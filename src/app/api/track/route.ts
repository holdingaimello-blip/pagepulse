import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VALID_EVENTS = [
  "page_view",
  "signup_started",
  "signup_completed",
  "monitor_created",
  "checkout_started",
  "payment_completed",
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, metadata = {}, user_id, session_id, page_url, referrer, utm_source, utm_medium, utm_campaign } = body;

    // Validate event type
    if (!event_type || !VALID_EVENTS.includes(event_type)) {
      return NextResponse.json(
        { error: "Invalid event_type", valid_events: VALID_EVENTS },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Insert event
    const { data, error } = await supabase
      .from("analytics_events")
      .insert({
        event_type,
        user_id,
        session_id,
        page_url,
        referrer,
        utm_source,
        utm_medium,
        utm_campaign,
        metadata,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to track event", details: error.message },
        { status: 500 }
      );
    }

    // Optional: Send to Vercel Analytics server-side
    // (if needed for redundancy)

    return NextResponse.json({
      success: true,
      event_id: data.id,
      event_type,
      timestamp: data.created_at,
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: "Tracking failed", details: error.message },
      { status: 500 }
    );
  }
}
