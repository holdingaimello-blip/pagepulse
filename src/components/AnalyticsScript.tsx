"use client";

import { useEffect } from "react";

export function AnalyticsScript() {
  useEffect(() => {
    // Track page view on client side
    if (typeof window !== "undefined") {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "page_view",
          page_url: window.location.href,
          referrer: document.referrer,
        }),
      }).catch(console.error);
    }
  }, []);

  return null;
}
