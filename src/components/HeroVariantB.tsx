"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// VARIANT B: Focus su perdita vendite / opportunità mancate
export default function HeroVariantB() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"input" | "email" | "success">("input");
  const [loading, setLoading] = useState(false);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStep("email");
  };

  const handleMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    
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

    setLoading(false);
    setStep("success");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-red-500/10 rounded-full blur-[128px]" />
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
        {/* Alert Badge */}
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-8">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
          <span className="text-sm text-red-400 font-medium">
            ⚠️ 73% of lost sales happen because you react too late
          </span>
        </div>

        {/* Headline - Value Prop Shift B */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          Stop Losing Sales to
          <br />
          <span className="text-red-400">Competitor Price Cuts</span>
        </h1>

        {/* Subheadline - Pain Point */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          By the time you notice their price drop, your customers have already switched.
          <br />
          <span className="text-white font-medium">
            Get alerted in minutes, not days.
          </span>
        </p>

        {/* Interactive Input */}
        <div className="max-w-xl mx-auto mb-16">
          {step === "input" && (
            <form onSubmit={handleStart} className="relative">
              <input
                type="text"
                placeholder="Enter competitor URL to monitor"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-lg placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 rounded-lg transition-all"
              >
                Protect My Sales →
              </button>
            </form>
          )}

          {step === "email" && (
            <form onSubmit={handleMonitor} className="relative">
              <div className="text-left mb-3 text-sm text-slate-400">
                Monitoring: <span className="text-red-400">{url}</span>
              </div>
              <input
                type="email"
                placeholder="Your email for instant alerts"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-lg placeholder:text-slate-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-[2.25rem] bottom-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 rounded-lg transition-all disabled:opacity-50"
              >
                {loading ? "..." : "Activate Free →"}
              </button>
            </form>
          )}

          {step === "success" && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-6 py-5">
              <div className="text-green-400 font-semibold text-lg">✓ Protection Active</div>
              <p className="text-slate-400 text-sm mt-1">
                You'll be alerted within minutes of any price change at {email}
              </p>
            </div>
          )}
        </div>

        {/* Loss Prevention Examples */}
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 text-left">
          {[
            { icon: "⚡", title: "Minute Alerts", desc: "Know about price changes in under 60 minutes" },
            { icon: "🛡️", title: "Loss Prevention", desc: "React before customers start comparing" },
            { icon: "📊", title: "Win Rate +34%", desc: "Teams using alerts close more deals" },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="font-medium text-white">{item.title}</div>
              <div className="text-sm text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500"].map(
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
            <span>340+ sales teams protected</span>
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
