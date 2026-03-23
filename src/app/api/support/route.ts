import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, subject, message } = body;

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sb = getSupabaseAdmin();
    if (!sb) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    // Save ticket to database
    const { data: ticket, error: insertError } = await sb
      .from("support_tickets")
      .insert({ email, subject, message })
      .select()
      .single();

    if (insertError) {
      console.error("Support ticket insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save ticket" },
        { status: 500 }
      );
    }

    // Generate AI response using Gemini
    let aiResponse = "";
    try {
      aiResponse = await generateAIResponse(subject, message);
      
      // Update ticket with AI response
      await sb
        .from("support_tickets")
        .update({ ai_response: aiResponse })
        .eq("id", ticket.id);
    } catch (aiError) {
      console.error("AI response generation failed:", aiError);
      aiResponse = "Our AI assistant is currently unavailable. A human will review your ticket shortly.";
    }

    return NextResponse.json({ 
      success: true, 
      ticketId: ticket.id,
      aiResponse 
    });
  } catch (error) {
    console.error("Support API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateAIResponse(subject: string, message: string): Promise<string> {
  const prompt = `You are PagePulse Support AI, a helpful assistant for a website monitoring SaaS. 

PagePulse features:
- Monitor competitor websites for changes
- AI-powered change detection and summaries
- Email notifications when changes are detected
- Daily checks on all plans
- Free: 1 URL, Pro: $4.99/mo (5 URLs), Business: $14.99/mo (25 URLs)

User message:
Subject: ${subject}
Message: ${message}

Provide a helpful, concise response (max 150 words). If you cannot resolve the issue, acknowledge it and say a human will follow up.`;

  // Try Gemini API first
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.3 }
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Thank you for your message. We'll get back to you soon.";
      }
    } catch (e) {
      console.error("Gemini API error:", e);
    }
  }

  // Fallback to OpenAI if available
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && !openaiKey.includes("your-key")) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 300,
          temperature: 0.3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return data.choices?.[0]?.message?.content || "Thank you for your message. We'll get back to you soon.";
      }
    } catch (e) {
      console.error("OpenAI fallback error:", e);
    }
  }

  // Final fallback
  return "Thank you for contacting PagePulse support. We've received your message and will respond within 24 hours.";
}
