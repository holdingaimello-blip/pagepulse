import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const STORE_DIR = path.join(process.cwd(), ".pagepulse-store");

function urlToKey(url: string): string {
  return crypto.createHash("sha256").update(url).digest("hex");
}

async function ensureStoreDir(): Promise<void> {
  try {
    await fs.mkdir(STORE_DIR, { recursive: true });
  } catch {
    // Directory already exists
  }
}

export async function getStoredContent(url: string): Promise<string | null> {
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, `${urlToKey(url)}.json`);

  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    return data.content || null;
  } catch {
    return null;
  }
}

export async function storeContent(url: string, content: string): Promise<void> {
  await ensureStoreDir();
  const filePath = path.join(STORE_DIR, `${urlToKey(url)}.json`);

  const data = {
    url,
    content,
    storedAt: new Date().toISOString(),
  };

  await fs.writeFile(filePath, JSON.stringify(data), "utf-8");
}

export async function getAllStoredUrls(): Promise<
  Array<{ url: string; storedAt: string }>
> {
  await ensureStoreDir();

  try {
    const files = await fs.readdir(STORE_DIR);
    const entries: Array<{ url: string; storedAt: string }> = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const raw = await fs.readFile(path.join(STORE_DIR, file), "utf-8");
        const data = JSON.parse(raw);
        entries.push({ url: data.url, storedAt: data.storedAt });
      } catch {
        continue;
      }
    }

    return entries;
  } catch {
    return [];
  }
}
