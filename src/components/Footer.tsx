import Link from "next/link";

const styles: Record<string, React.CSSProperties> = {
  footer: {
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    backgroundColor: "#0f172a",
    padding: "3rem 1rem",
  },
  container: {
    maxWidth: "80rem",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "2rem",
    marginBottom: "3rem",
  },
  brand: {
    gridColumn: "span 2",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1rem",
    textDecoration: "none",
  },
  logoIcon: {
    width: "2rem",
    height: "2rem",
    backgroundColor: "#3b82f6",
    borderRadius: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "1.125rem",
    fontWeight: 700,
    color: "white",
  },
  logoAccent: {
    color: "#60a5fa",
  },
  tagline: {
    fontSize: "0.875rem",
    color: "#64748b",
    lineHeight: 1.6,
  },
  column: {},
  columnTitle: {
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "white",
    marginBottom: "1rem",
  },
  links: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    fontSize: "0.875rem",
    color: "#94a3b8",
    textDecoration: "none",
    display: "block",
    marginBottom: "0.75rem",
  },
  disabled: {
    fontSize: "0.875rem",
    color: "#475569",
    display: "block",
    marginBottom: "0.75rem",
  },
  bottom: {
    borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    paddingTop: "2rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  copyright: {
    fontSize: "0.875rem",
    color: "#64748b",
  },
  socials: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  socialLink: {
    color: "#64748b",
  },
};

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* Brand */}
          <div style={styles.brand}>
            <Link href="/" style={styles.logo}>
              <div style={styles.logoIcon}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <span style={styles.logoText}>
                Page<span style={styles.logoAccent}>Pulse</span>
              </span>
            </Link>
            <p style={styles.tagline}>
              AI-powered website monitoring and competitor intelligence for modern teams.
            </p>
          </div>

          {/* Product */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Product</h4>
            <ul style={styles.links}>
              <li><a href="#features" style={styles.link}>Features</a></li>
              <li><a href="#pricing" style={styles.link}>Pricing</a></li>
              <li><span style={styles.disabled}>API Docs (coming soon)</span></li>
            </ul>
          </div>

          {/* Company */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Company</h4>
            <ul style={styles.links}>
              <li><Link href="/support" style={styles.link}>Support</Link></li>
              <li><span style={styles.disabled}>About (coming soon)</span></li>
              <li><span style={styles.disabled}>Blog (coming soon)</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div style={styles.column}>
            <h4 style={styles.columnTitle}>Legal</h4>
            <ul style={styles.links}>
              <li><Link href="/privacy" style={styles.link}>Privacy Policy</Link></li>
              <li><Link href="/terms" style={styles.link}>Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={styles.bottom}>
          <p style={styles.copyright}>© 2026 PagePulse. All rights reserved.</p>
          <div style={styles.socials}>
            <a href="https://twitter.com/pagepulse" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://github.com/pagepulse" style={styles.socialLink} target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
