import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getSupabaseAdmin } from "./supabase";

const STORE_DIR = path.join(process.cwd(), ".pagepulse-store");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function urlToKey(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex");
}

function contentHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

async function ensureStoreDir(): Promise<void> {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

function useSupabase(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ---------------------------------------------------------------------------
// getStoredContent
// ---------------------------------------------------------------------------

export async function getStoredContent(url: string): Promise<string | null> {
  if (useSupabase()) {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data } = await sb
        .from("monitored_urls")
        .select("last_content_hash")
        .eq("url", url)
        .eq("status", "active")
        .limit(1)
        .single();
      return data?.last_content_hash ?? null;
    }
  }

  // Local fallback
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, `${urlToKey(url)}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const stored = JSON.parse(raw);
    return stored.content || null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// storeContent
// ---------------------------------------------------------------------------

export async function storeContent(
  url: string,
  content: string,
  aiSummary?: string
): Promise<{ changed: boolean }> {
  const hash = contentHash(content);

  if (useSupabase()) {
    const sb = getSupabaseAdmin();
    if (sb) {
      // Check if URL already exists
      const { data: existing } = await sb
        .from("monitored_urls")
        .select("id, last_content_hash")
        .eq("url", url)
        .eq("status", "active")
        .limit(1)
        .single();

      const previousHash = existing?.last_content_hash ?? null;
      const changed = previousHash !== null && previousHash !== hash;

      if (existing) {
        // Update existing
        await sb
          .from("monitored_urls")
          .update({
            last_content_hash: hash,
            last_checked_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        // Record change if content differs
        if (changed) {
          await sb.from("changes").insert({
            monitored_url_id: existing.id,
            previous_hash: previousHash,
            new_hash: hash,
            ai_summary: aiSummary || null,
            raw_diff_size: Math.abs(content.length - (previousHash?.length || 0)),
          });
        }
      } else {
        // Insert new monitored URL (no user association for now)
        await sb.from("monitored_urls").insert({
          url,
          last_content_hash: hash,
          last_checked_at: new Date().toISOString(),
          status: "active",
        });
      }

      return { changed };
    }
  }

  // Local fallback
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, `${urlToKey(url)}.json`);

  let previousContent: string | null = null;
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const stored = JSON.parse(raw);
    previousContent = stored.content || null;
  } catch {
    // first time
  }

  const data = {
    url,
    content,
    contentHash: hash,
    storedAt: new Date().toISOString(),
  };
  await fs.writeFile(filePath, JSON.stringify(data), "utf-8");

  return { changed: previousContent !== null && previousContent !== content };
}

// ---------------------------------------------------------------------------
// getChangeHistory
// ---------------------------------------------------------------------------

export async function getChangeHistory(
  url: string,
  limit = 20
): Promise<
  Array<{
    previousHash: string | null;
    newHash: string;
    aiSummary: string | null;
    detectedAt: string;
  }>
> {
  if (useSupabase()) {
    const sb = getSupabaseAdmin();
    if (sb) {
      // Find the monitored URL
      const { data: monUrl } = await sb
        .from("monitored_urls")
        .select("id")
        .eq("url", url)
        .limit(1)
        .single();

      if (!monUrl) return [];

      const { data } = await sb
        .from("changes")
        .select("previous_hash, new_hash, ai_summary, detected_at")
        .eq("monitored_url_id", monUrl.id)
        .order("detected_at", { ascending: false })
        .limit(limit);

      return (data || []).map((row) => ({
        previousHash: row.previous_hash,
        newHash: row.new_hash,
        aiSummary: row.ai_summary,
        detectedAt: row.detected_at,
      }));
    }
  }

  // Local fallback: no history stored in file-based mode
  return [];
}

// ---------------------------------------------------------------------------
// getAllStoredUrls
// ---------------------------------------------------------------------------

export async function getAllStoredUrls(): Promise<
  Array<{ url: string; storedAt: string; lastHash: string | null }>
> {
  if (useSupabase()) {
    const sb = getSupabaseAdmin();
    if (sb) {
      const { data } = await sb
        .from("monitored_urls")
        .select("url, last_content_hash, last_checked_at, created_at")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      return (data || []).map((row) => ({
        url: row.url,
        storedAt: row.last_checked_at || row.created_at,
        lastHash: row.last_content_hash,
      }));
    }
  }

  // Local fallback
  await ensureStoreDir();

  try {
    const files = await fs.readdir(STORE_DIR);
    const entries: Array<{
      url: string;
      storedAt: string;
      lastHash: string | null;
    }> = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await fs.readFile(path.join(STORE_DIR, file), "utf-8");
        const stored = JSON.parse(raw);
        entries.push({
          url: stored.url,
          storedAt: stored.storedAt,
          lastHash: stored.contentHash || null,
        });
      } catch {
        continue;
      }
    }

    return entries;
  } catch {
    return [];
  }
}
