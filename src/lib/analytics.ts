import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate session ID
function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let sessionId = localStorage.getItem("pp_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem("pp_session_id", sessionId);
  }
  return sessionId;
}

// Get UTM params from URL
function getUtmParams() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
  };
}

// Track event
export async function trackEvent(
  eventType: string,
  metadata: Record<string, any> = {}
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from("analytics_events").insert({
      event_type: eventType,
      user_id: user?.id,
      session_id: getSessionId(),
      page_url: typeof window !== "undefined" ? window.location.href : undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      ...getUtmParams(),
      metadata,
    });
  } catch (error) {
    console.error("Analytics error:", error);
  }
}

// Predefined events
export const analytics = {
  pageView: () => trackEvent("page_view"),
  signupStarted: () => trackEvent("signup_started"),
  signupCompleted: () => trackEvent("signup_completed"),
  monitorCreated: () => trackEvent("monitor_created"),
  checkoutStarted: (plan: string) => trackEvent("checkout_started", { plan }),
  paymentCompleted: (plan: string, amount: number) => trackEvent("payment_completed", { plan, amount }),
};
