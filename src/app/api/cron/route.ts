import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase";
import { analyzeChanges } from "@/lib/analyzer";

const MAX_URLS_PER_RUN = 10;

function contentHash(content: string): string {
  return crypto.createHash("sha256").update(content).digest("hex");
}

export async function GET(request: NextRequest) {
  // Verify CRON_SECRET
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = getSupabaseAdmin();
  if (!sb) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    // Fetch active monitored URLs, prioritizing those checked longest ago
    const { data: urls, error: fetchError } = await sb
      .from("monitored_urls")
      .select("id, url, last_content_hash, last_checked_at, user_id")
      .eq("status", "active")
      .order("last_checked_at", { ascending: true, nullsFirst: true })
      .limit(MAX_URLS_PER_RUN);

    if (fetchError) {
      console.error("Error fetching monitored URLs:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch monitored URLs" },
        { status: 500 }
      );
    }

    if (!urls || urls.length === 0) {
      return NextResponse.json({
        checked: 0,
        changed: 0,
        message: "No active URLs to monitor",
      });
    }

    const results: Array<{
      url: string;
      changed: boolean;
      error?: string;
    }> = [];

    for (const entry of urls) {
      try {
        // Fetch the page
        const response = await fetch(entry.url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; PagePulse/1.0; +https://pagepulse.eu)",
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          results.push({
            url: entry.url,
            changed: false,
            error: `HTTP ${response.status}`,
          });
          continue;
        }

        const currentContent = await response.text();
        const currentHash = contentHash(currentContent);
        const previousHash = entry.last_content_hash;

        // Update last_checked_at regardless
        await sb
          .from("monitored_urls")
          .update({
            last_content_hash: currentHash,
            last_checked_at: new Date().toISOString(),
          })
          .eq("id", entry.id);

        if (previousHash && previousHash !== currentHash) {
          // Content changed — generate AI summary
          let aiSummary: string | null = null;
          try {
            // We don't have the previous raw content (only hash), so generate
            // a summary based on the new content and the fact it changed.
            // For a full diff, we'd need to store raw content — using the
            // existing analyzer with a minimal fallback.
            aiSummary = await analyzeChanges(
              entry.url,
              `[Previous content hash: ${previousHash}]`,
              currentContent
            );
          } catch {
            aiSummary = "Content changed but summary generation failed.";
          }

          // Record the change
          await sb.from("changes").insert({
            monitored_url_id: entry.id,
            previous_hash: previousHash,
            new_hash: currentHash,
            ai_summary: aiSummary,
            raw_diff_size: currentContent.length,
          });

          // Create notification for the URL owner
          if (entry.user_id) {
            await sb.from("notifications").insert({
              user_id: entry.user_id,
              monitored_url_id: entry.id,
              message: aiSummary || `Change detected on ${entry.url}`,
            });
          }

          results.push({ url: entry.url, changed: true });
        } else {
          results.push({ url: entry.url, changed: false });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        results.push({ url: entry.url, changed: false, error: message });
      }
    }

    const changedCount = results.filter((r) => r.changed).length;

    return NextResponse.json({
      checked: results.length,
      changed: changedCount,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Internal cron job error" },
      { status: 500 }
    );
  }
}
