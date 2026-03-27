import Link from "next/link";

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
  },
  container: {
    maxWidth: "80rem",
    margin: "0 auto",
    padding: "0 1rem",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "4rem",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
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
    fontSize: "1.25rem",
    fontWeight: 700,
    color: "white",
  },
  logoAccent: {
    color: "#60a5fa",
  },
  desktopNav: {
    display: "none",
    alignItems: "center",
    gap: "1.5rem",
  },
  navLink: {
    color: "#cbd5e1",
    fontSize: "0.875rem",
    textDecoration: "none",
  },
  button: {
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: 500,
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    textDecoration: "none",
  },
};

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.inner}>
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

          <div style={{ ...styles.desktopNav, display: "flex" }}>
            <Link href="/#features" style={styles.navLink}>Features</Link>
            <Link href="/#pricing" style={styles.navLink}>Pricing</Link>
            <Link href="/auth/login" style={styles.navLink}>Login</Link>
            <Link href="/auth/signup" style={styles.button}>Sign Up Free</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
