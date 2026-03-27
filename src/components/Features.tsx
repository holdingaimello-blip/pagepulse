const styles: Record<string, React.CSSProperties> = {
  section: {
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
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "1rem",
    padding: "2rem",
    transition: "background-color 0.3s",
  },
  icon: {
    width: "3rem",
    height: "3rem",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#60a5fa",
    marginBottom: "1.5rem",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
    marginBottom: "0.75rem",
    color: "white",
  },
  cardDesc: {
    color: "#94a3b8",
    lineHeight: 1.6,
    marginBottom: "1.5rem",
  },
  highlights: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  highlight: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    color: "#cbd5e1",
    marginBottom: "0.5rem",
  },
  check: {
    color: "#60a5fa",
    flexShrink: 0,
  },
};

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Smart Change Detection",
    description: "Go beyond simple text diffs. PagePulse understands page structure and detects meaningful changes in pricing, features, messaging, and layout.",
    highlights: ["Structural page analysis", "Price change alerts", "New feature detection", "Content shift tracking"],
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
    title: "AI Noise Filtering",
    description: "Cookie banners updated? Timestamp changed? PagePulse's AI filters out meaningless changes so you only get alerts that matter.",
    highlights: ["Ignores cosmetic updates", "Filters tracking changes", "Skips ad rotations", "Zero false positives"],
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Competitor Intelligence Reports",
    description: "Get weekly AI-generated intelligence briefs that summarize all competitor activity. Understand market trends at a glance.",
    highlights: ["Weekly AI summaries", "Trend analysis", "Strategic insights", "Email + Slack delivery"],
  },
];

export default function Features() {
  return (
    <section id="features" style={styles.section}>
      <div style={styles.container}>
        <div style={styles.header}>
          <p style={styles.label}>Features</p>
          <h2 style={styles.title}>Everything you need to stay ahead</h2>
          <p style={styles.subtitle}>
            PagePulse combines intelligent monitoring with AI analysis to give you a competitive edge that&apos;s always on.
          </p>
        </div>

        <div style={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{feature.icon}</div>
              <h3 style={styles.cardTitle}>{feature.title}</h3>
              <p style={styles.cardDesc}>{feature.description}</p>
              <ul style={styles.highlights}>
                {feature.highlights.map((item, i) => (
                  <li key={i} style={styles.highlight}>
                    <span style={styles.check}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
