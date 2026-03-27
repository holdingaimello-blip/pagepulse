export default function LoginPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#0f172a",
      padding: "1rem"
    }}>
      <div style={{
        maxWidth: "400px",
        width: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "1rem",
        padding: "2rem"
      }}>
        <h1 style={{ 
          fontSize: "1.5rem", 
          fontWeight: 700, 
          color: "white",
          marginBottom: "0.5rem",
          textAlign: "center"
        }}>Welcome back</h1>
        <p style={{ 
          color: "#94a3b8", 
          fontSize: "0.875rem",
          textAlign: "center",
          marginBottom: "2rem"
        }}>Sign in to your PagePulse account</p>

        <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="email"
            placeholder="Email"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              color: "white",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          <input
            type="password"
            placeholder="Password"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              color: "white",
              fontSize: "1rem",
              outline: "none"
            }}
          />
          
          <button
            type="submit"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: 600,
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Sign In
          </button>
        </form>

        <p style={{ 
          color: "#64748b", 
          fontSize: "0.875rem",
          textAlign: "center",
          marginTop: "1.5rem"
        }}>
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" style={{ color: "#60a5fa", textDecoration: "none" }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}
