// Server-side analytics client
// Calls /api/track endpoint for reliable tracking

const API_URL = typeof window !== "undefined" 
  ? "/api/track" 
  : process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/track`
    : "https://pagepulse.eu/api/track";

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
function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  const source = params.get("utm_source");
  const medium = params.get("utm_medium");
  const campaign = params.get("utm_campaign");
  if (source) result.utm_source = source;
  if (medium) result.utm_medium = medium;
  if (campaign) result.utm_campaign = campaign;
  return result;
}

// Track event via API
async function trackEvent(
  eventType: string,
  metadata: Record<string, any> = {}
): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        session_id: getSessionId(),
        page_url: typeof window !== "undefined" ? window.location.href : undefined,
        referrer: typeof document !== "undefined" ? document.referrer : undefined,
        ...getUtmParams(),
        metadata,
      }),
    });

    if (!response.ok) {
      console.error("Analytics error:", await response.text());
    }
  } catch (error) {
    console.error("Analytics tracking failed:", error);
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
