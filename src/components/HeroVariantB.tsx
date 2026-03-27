"use client";

import { useState, useEffect } from "react";

// VARIANT B: Focus su perdita vendite
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
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "9999px",
    padding: "0.375rem 1rem",
    marginBottom: "2rem",
    fontSize: "0.875rem",
    color: "#f87171",
    fontWeight: 500,
  },
  pulse: {
    width: "0.5rem",
    height: "0.5rem",
    backgroundColor: "#f87171",
    borderRadius: "50%",
    animation: "pulse 2s infinite",
  },
  headline: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: "1.5rem",
    color: "white",
  },
  alertText: {
    color: "#f87171",
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
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.75rem",
    padding: "1rem 1.25rem",
    fontSize: "1rem",
    color: "white",
    outline: "none",
  },
  button: {
    backgroundColor: "#ef4444",
    color: "white",
    fontWeight: 600,
    padding: "1rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    whiteSpace: "nowrap",
  },
  useCases: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    maxWidth: "48rem",
    margin: "0 auto 3rem",
    textAlign: "left",
  },
  useCaseCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "0.75rem",
    padding: "1rem",
  },
  socialProof: {
    display: "flex",
    flexDirection: "column",
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

export default function HeroVariantB() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "email" | "success">("input");
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const initSupabase = async () => {
      if (typeof window !== "undefined") {
        const { createClient } = await import("@supabase/supabase-js");
        const client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || "",
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
        );
        setSupabase(client);
      }
    };
    initSupabase();
  }, []);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStep("email");
  };

  const handleMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    if (supabase) {
      try {
        const { data: userData } = await supabase
          .from("users")
          .insert([{ email, plan: "free", url_limit: 1 }])
          .select()
          .single();
        if (userData) {
          await supabase.from("monitored_urls").insert([
            {
              user_id: userData.id,
              url: url.startsWith("http") ? url : `https://${url}`,
              status: "active",
            },
          ]);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    setLoading(false);
    setStep("success");
  };

  const useCases = [
    { icon: "⚡", title: "Minute Alerts", desc: "Know about price changes in under 60 minutes" },
    { icon: "🛡️", title: "Loss Prevention", desc: "React before customers start comparing" },
    { icon: "📊", title: "Win Rate +34%", desc: "Teams using alerts close more deals" },
  ];

  const avatarColors = ["#ef4444", "#f97316", "#f59e0b", "#eab308"];

  return (
    <section style={styles.section}>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      <div style={styles.container}>
        {/* Alert Badge */}
        <div style={styles.badge}>
          <span style={styles.pulse} />
          <span>⚠️ 73% of lost sales happen because you react too late</span>
        </div>

        {/* Headline */}
        <h1 style={styles.headline}>
          Stop Losing Sales to
          <br />
          <span style={styles.alertText}>Competitor Price Cuts</span>
        </h1>

        {/* Subheadline */}
        <p style={styles.subheadline}>
          By the time you notice their price drop, your customers have already switched.
          <br />
          <strong style={{ color: "white" }}>Get alerted in minutes, not days.</strong>
        </p>

        {/* Form */}
        <div style={styles.form}>
          {step === "input" && (
            <form onSubmit={handleStart} style={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Enter competitor URL to monitor"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>
                Protect My Sales →
              </button>
            </form>
          )}

          {step === "email" && (
            <form onSubmit={handleMonitor}>
              <div style={{ textAlign: "left", marginBottom: "0.75rem", fontSize: "0.875rem", color: "#94a3b8" }}>
                Monitoring: <span style={{ color: "#f87171" }}>{url}</span>
              </div>
              <div style={styles.inputWrapper}>
                <input
                  type="email"
                  placeholder="Your email for instant alerts"
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
              <div style={{ color: "#22c55e", fontWeight: 600, fontSize: "1.125rem" }}>✓ Protection Active</div>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                You&apos;ll be alerted within minutes of any price change at {email}
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
            <span>340+ sales teams protected</span>
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
