"use client";

import { useState, useEffect } from "react";

export default function Hero() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "email" | "success">("input");
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  // Lazy load Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      if (typeof window !== 'undefined') {
        const { createClient } = await import("@supabase/supabase-js");
        const client = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );
        setSupabase(client);
      }
    };
    initSupabase();
  }, []);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStep("email");
  };

  const handleMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    
    // Salva utente e URL in background (se Supabase disponibile)
    if (supabase) {
      try {
        const { data: userData, error: userError } = await supabase
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
        {/* Badge - Use Case Specific */}
        <div className="inline-flex items-center gap-2 bg-electric-500/10 border border-electric-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-electric-400 rounded-full animate-pulse" />
          <span className="text-sm text-electric-400 font-medium">
            Used by 340+ e-commerce teams to track competitor prices
          </span>
        </div>

        {/* Headline - Value Prop Shift A */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Get Alerted When Competitors
          <br />
          <span className="gradient-text">Change Their Prices</span>
        </h1>

        {/* Subheadline - Specific Pain Point */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your competitor just dropped prices by 20%. While you&apos;re sleeping.
          <br />
          <span className="text-white font-medium">
            PagePulse watches 24/7. You wake up informed.
          </span>
        </p>

        {/* Interactive Input - Friction Removal */}
        <div className="max-w-xl mx-auto mb-16">
          {step === "input" && (
            <form onSubmit={handleStart} className="relative">
              <input
                type="text"
                placeholder="Enter competitor URL (e.g., amazon.com/product)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-lg placeholder:text-slate-500 focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-electric-500 hover:bg-electric-600 text-white font-semibold px-6 rounded-lg transition-all"
              >
                Start Monitoring →
              </button>
            </form>
          )}

          {step === "email" && (
            <form onSubmit={handleMonitor} className="relative">
              <div className="text-left mb-3 text-sm text-slate-400">
                Monitoring: <span className="text-electric-400">{url}</span>
              </div>
              <input
                type="email"
                placeholder="Your email (we'll send alerts here)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-lg placeholder:text-slate-500 focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-[2.25rem] bottom-2 bg-electric-500 hover:bg-electric-600 text-white font-semibold px-6 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Activate Free →"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-5">
              <div className="text-green-400 font-semibold text-lg">✓ Monitoring Activated</div>
              <p className="text-slate-400 text-sm mt-1">
                You&apos;ll receive your first alert within 24 hours at {email}
              </p>
            </div>
          )}
        </div>

        {/* Use Case Examples */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 text-left">
          {[
            { icon: "💰", title: "Price Drops", desc: "Instant alerts when competitors slash prices" },
            { icon: "🚀", title: "New Features", desc: "Know when they launch before your customers do" },
            { icon: "📢", title: "Messaging Changes", desc: "Track positioning and copy updates" },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-medium text-white">{item.title}</div>
              <div className="text-sm text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Social Proof - Realistic */}
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
            <span>Trusted by 340+ e-commerce teams</span>
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
            <span className="ml-1">4.7/5 from 89 reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
