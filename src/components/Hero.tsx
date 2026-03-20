import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-electric-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-electric-600/5 rounded-full blur-[96px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-electric-500/10 border border-electric-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-electric-400 rounded-full animate-pulse" />
          <span className="text-sm text-electric-400 font-medium">
            pagepulse.site — Now monitoring 10,000+ competitor pages
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Know When Your Competitors Change
          <br />
          <span className="gradient-text">
            Before They Know You&apos;re Watching
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI-powered website monitoring that tells you{" "}
          <span className="text-white font-medium">WHAT</span> changed and{" "}
          <span className="text-white font-medium">WHY</span> it matters.
          Stop refreshing competitor pages — let PagePulse do the watching.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="bg-electric-500 hover:bg-electric-600 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-electric-500/25 w-full sm:w-auto"
          >
            Start Monitoring Free →
          </Link>
          <a
            href="#features"
            className="text-slate-300 hover:text-white text-lg font-medium px-8 py-4 rounded-xl border border-white/10 hover:border-white/20 transition-all w-full sm:w-auto"
          >
            See How It Works
          </a>
        </div>

        {/* Social proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500"].map(
                (color, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-navy-900 flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                )
              )}
            </div>
            <span>Trusted by 2,400+ teams</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-4 h-4 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1">4.8/5 from 142 reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
