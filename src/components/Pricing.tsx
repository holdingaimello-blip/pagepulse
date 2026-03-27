"use client";

import { useState } from "react";

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: "relative",
    padding: "6rem 1rem",
    backgroundColor: "#0f172a",
  },
  container: {
    maxWidth: "80rem",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "4rem",
  },
  label: {
    color: "#60a5fa",
    fontWeight: 600,
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.75rem",
  },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
    fontWeight: 700,
    marginBottom: "1rem",
    color: "white",
  },
  subtitle: {
    fontSize: "1.125rem",
    color: "#94a3b8",
    maxWidth: "42rem",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    maxWidth: "64rem",
    margin: "0 auto",
  },
  card: {
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "1rem",
    padding: "2rem",
  },
  cardHighlighted: {
    position: "relative",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    border: "2px solid rgba(59, 130, 246, 0.5)",
    borderRadius: "1rem",
    padding: "2rem",
    transform: "scale(1.05)",
  },
  badge: {
    position: "absolute",
    top: "-1rem",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#3b82f6",
    color: "white",
    fontSize: "0.75rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    padding: "0.375rem 1rem",
    borderRadius: "9999px",
  },
  planName: {
    fontSize: "1.125rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "white",
  },
  price: {
    fontSize: "2.25rem",
    fontWeight: 700,
    color: "white",
  },
  period: {
    color: "#94a3b8",
    fontSize: "0.875rem",
  },
  description: {
    color: "#94a3b8",
    fontSize: "0.875rem",
    marginBottom: "1.5rem",
  },
  button: {
    display: "block",
    width: "100%",
    textAlign: "center",
    fontWeight: 600,
    padding: "0.75rem 1.5rem",
    borderRadius: "0.75rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    marginBottom: "2rem",
  },
  buttonPrimary: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  buttonSecondary: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "white",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  features: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  feature: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    fontSize: "0.875rem",
    marginBottom: "0.75rem",
    color: "#cbd5e1",
  },
  check: {
    color: "#3b82f6",
    flexShrink: 0,
  },
  footer: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "0.875rem",
    marginTop: "3rem",
  },
};

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
  },
  {
    name: "Pro",
    price: "$4.99",
    period: "/month",
    description: "For teams that need deeper competitive intelligence.",
    features: [
      "Monitor up to 5 URLs",
      "Daily checks",
      "AI-powered change analysis",
      "Email notifications",
      "90-day change history",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$14.99",
    period: "/month",
    description: "Enterprise-grade monitoring for competitive teams.",
    features: [
      "Monitor up to 25 URLs",
      "Daily checks",
      "Advanced AI semantic analysis",
      "Email notifications",
      "Unlimited change history",
      "Priority support",
    ],
    cta: "Start Business Trial",
    highlighted: false,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(planName: string) {
    setLoading(planName);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert("Checkout simulation - Stripe integration needed");
    setLoading(null);
  }

  return (
    <section id="pricing" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>Pricing</p>
          <h2 style={styles.title}>Simple, transparent pricing</h2>
          <p style={styles.subtitle}>
            Start free. Upgrade when you need more power. No hidden fees, no contracts.
          </p>
        </div>

        <div style={styles.grid}>
          {plans.map((plan, index) => (
            <div
              key={index}
              style={plan.highlighted ? styles.cardHighlighted : styles.card}
            >
              {plan.highlighted && <span style={styles.badge}>Most Popular</span>}

              <h3 style={styles.planName}>{plan.name}</h3>

              <div style={{ marginBottom: "0.5rem" }}>
                <span style={styles.price}>{plan.price}</span>
                <span style={styles.period}>{plan.period}</span>
              </div>

              <p style={styles.description}>{plan.description}</p>

              <button
                onClick={() => handleCheckout(plan.name)}
                disabled={loading === plan.name}
                style={{
                  ...styles.button,
                  ...(plan.highlighted ? styles.buttonPrimary : styles.buttonSecondary),
                  opacity: loading === plan.name ? 0.5 : 1,
                }}
              >
                {loading === plan.name ? "Loading..." : plan.cta}
              </button>

              <ul style={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={styles.feature}>
                    <span style={styles.check}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={styles.footer}>
          All plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}
