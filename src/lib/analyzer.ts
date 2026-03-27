import OpenAI from "openai";

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "sk-your-key-here") {
    return null;
  }
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

/**
 * Strip HTML tags and excessive whitespace to get clean text for comparison.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Truncate text to a maximum length, keeping the most relevant parts.
 */
function truncate(text: string, maxLen: number = 6000): string {
  if (text.length <= maxLen) return text;
  const half = Math.floor(maxLen / 2);
  return (
    text.slice(0, half) +
    "\n\n[...content truncated...]\n\n" +
    text.slice(-half)
  );
}

/**
 * Analyze changes between two versions of a webpage using OpenAI.
 * Returns a human-readable summary of what changed and why it matters.
 */
export async function analyzeChanges(
  url: string,
  previousHtml: string,
  currentHtml: string
): Promise<string> {
  const previousText = truncate(stripHtml(previousHtml));
  const currentText = truncate(stripHtml(currentHtml));

  const openai = getOpenAI();
  if (!openai) {
    return generateFallbackSummary(previousText, currentText);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a competitive intelligence analyst. Analyze website changes and provide concise, actionable summaries. Focus on:
1. WHAT specifically changed (pricing, features, messaging, structure)
2. WHY it matters from a competitive standpoint
3. Any strategic implications

Keep responses under 200 words. Be specific and avoid vague statements. If changes are purely cosmetic or technical (CSS, tracking scripts), say so briefly.`,
        },
        {
          role: "user",
          content: `Analyze the changes detected on ${url}.

PREVIOUS VERSION:
${previousText}

CURRENT VERSION:
${currentText}

Provide a concise intelligence summary of what changed and why it matters.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return (
      response.choices[0]?.message?.content ||
      "Changes detected but unable to generate summary."
    );
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return generateFallbackSummary(previousText, currentText);
  }
}

/**
 * Generate a basic change summary without AI when the API key is unavailable.
 */
function generateFallbackSummary(
  previousText: string,
  currentText: string
): string {
  const prevWords = new Set(previousText.toLowerCase().split(/\s+/));
  const currWords = new Set(currentText.toLowerCase().split(/\s+/));

  const added = [...currWords].filter((w) => !prevWords.has(w)).length;
  const removed = [...prevWords].filter((w) => !currWords.has(w)).length;

  const prevLen = previousText.length;
  const currLen = currentText.length;
  const sizeDiff = currLen - prevLen;
  const sizeDirection = sizeDiff > 0 ? "larger" : "smaller";

  return `Content changes detected. The page is now ${Math.abs(sizeDiff).toLocaleString()} characters ${sizeDirection} (${prevLen.toLocaleString()} → ${currLen.toLocaleString()}). Approximately ${added} new words added and ${removed} words removed. Configure OPENAI_API_KEY for AI-powered semantic analysis.`;
}
