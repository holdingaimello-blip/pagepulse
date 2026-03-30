"use client";

import { useEffect } from "react";
import { analytics } from "../lib/analytics";

export function AnalyticsTracker() {
  useEffect(() => {
    // Track page view on mount
    analytics.pageView();
  }, []);

  return null; // No UI
}
