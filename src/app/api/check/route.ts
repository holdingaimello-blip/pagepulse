import { NextRequest, NextResponse } from "next/server";
import { getStoredContent, storeContent } from "@/lib/store";
import { analyzeChanges } from "@/lib/analyzer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'url' parameter" },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      const parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format. Must be a valid HTTP/HTTPS URL." },
        { status: 400 }
      );
    }

    // Fetch the page content
    let currentContent: string;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; PagePulse/1.0; +https://pagepulse.eu)",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            error: `Failed to fetch URL: HTTP ${response.status}`,
            changed: false,
            summary: `Could not access the URL (HTTP ${response.status}).`,
            timestamp: new Date().toISOString(),
          },
          { status: 502 }
        );
      }

      currentContent = await response.text();
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : "Unknown fetch error";
      return NextResponse.json(
        {
          error: `Failed to fetch URL: ${message}`,
          changed: false,
          summary: `Could not access the URL: ${message}`,
          timestamp: new Date().toISOString(),
        },
        { status: 502 }
      );
    }

    // Get previous stored content/hash
    const previousStored = await getStoredContent(url);
    const timestamp = new Date().toISOString();

    // Store the current content (also records change if applicable)
    const { changed } = await storeContent(url, currentContent);

    // First time checking this URL
    if (previousStored === null) {
      return NextResponse.json({
        changed: false,
        summary:
          "First snapshot captured. Future checks will compare against this baseline.",
        timestamp,
      });
    }

    if (!changed) {
      return NextResponse.json({
        changed: false,
        summary: "No changes detected since last check.",
        timestamp,
      });
    }

    // Content has changed — analyze with AI
    // In local mode previousStored is raw content; in Supabase mode it's a hash.
    // Use raw content comparison when available, otherwise provide minimal context.
    const previousForAnalysis = previousStored.length > 128
      ? previousStored
      : `[Previous version - hash: ${previousStored}]`;

    const summary = await analyzeChanges(url, previousForAnalysis, currentContent);

    // Update the change record with the AI summary if using Supabase
    await storeContent(url, currentContent, summary);

    return NextResponse.json({
      changed: true,
      summary,
      timestamp,
    });
  } catch (error) {
    console.error("Check API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        changed: false,
        summary: "An unexpected error occurred while processing the request.",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
