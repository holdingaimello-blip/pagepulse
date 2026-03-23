"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with competitor monitoring.",
    features: [
      "Monitor up to 1 URL",
      "Daily checks",
      "Basic change detection",
      "Email notifications",
      "7-day change history",
    ],
    cta: "Start Free",
    highlighted: false,
    planKey: null as string | null,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For teams that need deeper competitive intelligence.",
    features: [
      "Monitor up to 25 URLs",
      "Hourly checks",
      "AI-powered change analysis",
      "Slack + Email notifications",
      "90-day change history",
      "Weekly intelligence reports",
      "Export to CSV/PDF",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
    planKey: "pro",
  },
  {
    name: "Business",
    price: "$49",
    period: "/month",
    description: "Enterprise-grade monitoring for competitive teams.",
    features: [
      "Unlimited URLs",
      "Real-time monitoring (5min)",
      "Advanced AI semantic analysis",
      "All notification channels",
      "Unlimited change history",
      "Custom intelligence reports",
      "API access",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start Business Trial",
    highlighted: false,
    planKey: "business",
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planKey: string) {
    setLoading(planKey);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong. Please try again.");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-electric-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-electric-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Start free. Upgrade when you need more power. No hidden fees, no
            contracts.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "bg-electric-500/10 border-2 border-electric-500/50 scale-105"
                  : "glass-card hover:bg-white/[0.07]"
              }`}
            >
              {/* Popular Badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-electric-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>

              {/* Price */}
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>

              {/* Description */}
              <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

              {/* CTA Button */}
              {plan.planKey ? (
                <button
                  onClick={() => handleCheckout(plan.planKey!)}
                  disabled={loading === plan.planKey}
                  className={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-all mb-8 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.highlighted
                      ? "bg-electric-500 hover:bg-electric-600 text-white hover:shadow-lg hover:shadow-electric-500/25"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {loading === plan.planKey ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Redirecting...
                    </span>
                  ) : (
                    plan.cta
                  )}
                </button>
              ) : (
                <Link
                  href="/auth/signup"
                  className={`block text-center font-semibold py-3 px-6 rounded-xl transition-all mb-8 ${
                    plan.highlighted
                      ? "bg-electric-500 hover:bg-electric-600 text-white hover:shadow-lg hover:shadow-electric-500/25"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  {plan.cta}
                </Link>
              )}

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <svg
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        plan.highlighted ? "text-electric-400" : "text-slate-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-500 text-sm mt-12">
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
