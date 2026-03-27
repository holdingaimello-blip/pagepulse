"use client";

import { useState } from "react";

// Stili inline per evitare dipendenze Tailwind
const styles: Record<string, React.CSSProperties> = {
  section: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    overflow: "hidden",
  },
  container: {
    position: "relative",
    maxWidth: "64rem",
    margin: "0 auto",
    padding: "6rem 1rem 5rem",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    border: "1px solid rgba(59, 130, 246, 0.2)",
    borderRadius: "9999px",
    padding: "0.375rem 1rem",
    marginBottom: "2rem",
    fontSize: "0.875rem",
    color: "#60a5fa",
    fontWeight: 500,
  },
  pulse: {
    width: "0.5rem",
    height: "0.5rem",
    backgroundColor: "#60a5fa",
    borderRadius: "50%",
  },
  headline: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: "1.5rem",
    color: "white",
  },
  gradientText: {
    background: "linear-gradient(to right, #60a5fa, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subheadline: {
    fontSize: "1.125rem",
    color: "#94a3b8",
    maxWidth: "42rem",
    margin: "0 auto 2.5rem",
    lineHeight: 1.6,
  },
  form: {
    maxWidth: "36rem",
    margin: "0 auto 4rem",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap" as const,
  },
  input: {
    flex: 1,
    minWidth: "200px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    fontSize: "1rem",
    color: "white",
    outline: "none",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: 600,
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    whiteSpace: "nowrap" as const,
  },
  useCases: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    maxWidth: "48rem",
    margin: "0 auto 3rem",
    textAlign: "left" as const,
  },
  useCaseCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.75rem",
    padding: "1rem",
  },
  socialProof: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "1.5rem",
    fontSize: "0.875rem",
    color: "#64748b",
  },
  avatars: {
    display: "flex",
    marginRight: "0.5rem",
  },
  avatar: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    border: "2px solid #0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "white",
  },
  successBox: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    border: "1px solid rgba(34, 197, 94, 0.2)",
    borderRadius: "0.75rem",
    padding: "1.25rem",
  },
};

export default function Hero() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "email" | "success">("input");
  const [loading, setLoading] = useState(false);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStep("email");
  };

  const handleMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    
    // Simula salvataggio
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setLoading(false);
    setStep("success");
  };

  const useCases = [
    { icon: "💰", title: "Price Drops", desc: "Instant alerts when competitors slash prices" },
    { icon: "🚀", title: "New Features", desc: "Know when they launch before your customers do" },
    { icon: "📢", title: "Messaging Changes", desc: "Track positioning and copy updates" },
  ];

  const avatarColors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b"];

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        {/* Badge */}
        <div style={styles.badge}>
          <span style={styles.pulse} />
          <span>Used by 340+ e-commerce teams to track competitor prices</span>
        </div>

        {/* Headline */}
        <h1 style={styles.headline}>
          Get Alerted When Competitors
          <br />
          <span style={styles.gradientText}>Change Their Prices</span>
        </h1>

        {/* Subheadline */}
        <p style={styles.subheadline}>
          Your competitor just dropped prices by 20%. While you&apos;re sleeping.
          <br />
          <strong style={{ color: "white" }}>PagePulse watches 24/7. You wake up informed.</strong>
        </p>

        {/* Form */}
        <div style={styles.form}>
          {step === "input" && (
            <form onSubmit={handleStart} style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter competitor URL (e.g., amazon.com/product)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Start Monitoring →
              </button>
            </form>
          )}

          {step === "email" && (
            <form onSubmit={handleMonitor}>
              <div style={{ textAlign: "left", marginBottom: "0.75rem", fontSize: "0.875rem", color: "#94a3b8" }}>
                Monitoring: <span style={{ color: "#60a5fa" }}>{url}</span>
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Your email (we'll send alerts here)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  autoFocus
                />
                <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.5 : 1 }}>
                  {loading ? "..." : "Activate Free →"}
                </button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div style={styles.successBox}>
              <div style={{ color: "#22c55e", fontWeight: 600, fontSize: "1.125rem" }}>✓ Monitoring Activated</div>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                You&apos;ll receive your first alert within 24 hours at {email}
              </p>
            </div>
          )}
        </div>

        {/* Use Cases */}
        <div style={styles.useCases}>
          {useCases.map((item, i) => (
            <div key={i} style={styles.useCaseCard}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{item.icon}</div>
              <div style={{ fontWeight: 500, color: "white", marginBottom: "0.25rem" }}>{item.title}</div>
              <div style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div style={styles.socialProof}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={styles.avatars}>
              {avatarColors.map((color, i) => (
                <div key={i} style={{ ...styles.avatar, backgroundColor: color, marginLeft: i === 0 ? 0 : "-0.5rem" }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span>Trusted by 340+ e-commerce teams</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {"★".repeat(5).split("").map((_, i) => (
              <span key={i} style={{ color: "#fbbf24" }}>★</span>
            ))}
            <span style={{ marginLeft: "0.25rem" }}>4.7/5 from 89 reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
