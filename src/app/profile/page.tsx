"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface UserData {
  id: string;
  email: string;
  name?: string;
  plan: string;
  url_limit: number;
  stripe_subscription_id?: string | null;
  created_at: string;
}

interface UsageStats {
  urlsMonitored: number;
  changesDetected: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<UsageStats>({ urlsMonitored: 0, changesDetected: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [editName, setEditName] = useState("");

  const supabase = createSupabaseBrowser();

  const loadData = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser?.email) {
      window.location.href = "/auth/login";
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email)
      .single();

    if (!userData) {
      window.location.href = "/auth/login";
      return;
    }

    setUser(userData as UserData);
    setEditName(userData.name || "");

    const { count: urlCount } = await supabase
      .from("monitored_urls")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userData.id);

    const { data: urls } = await supabase
      .from("monitored_urls")
      .select("id")
      .eq("user_id", userData.id);

    let totalChanges = 0;
    if (urls && urls.length > 0) {
      const urlIds = urls.map(u => u.id);
      const { count: changesCount } = await supabase
        .from("changes")
        .select("*", { count: "exact", head: true })
        .in("monitored_url_id", urlIds);
      totalChanges = changesCount || 0;
    }

    setStats({ urlsMonitored: urlCount || 0, changesDetected: totalChanges });
    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  async function updateProfile() {
    if (!user) return;
    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from("users")
      .update({ name: editName })
      .eq("id", user.id);

    if (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully" });
      loadData();
    }
    setSaving(false);
  }

  async function cancelSubscription() {
    if (!confirm("Cancel subscription? You'll keep access until the end of your billing period, then be downgraded to Free.")) return;
    setCancelling(true);
    setMessage(null);

    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      if (res.ok) {
        setMessage({ type: "success", text: "Subscription cancelled successfully" });
        loadData();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Failed to cancel subscription" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to cancel subscription" });
    }
    setCancelling(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-electric-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const planColors: Record<string, string> = {
    free: "bg-slate-600",
    pro: "bg-electric-500",
    business: "bg-purple-500",
  };

  const planLimits: Record<string, { urls: number; checks: string }> = {
    free: { urls: 1, checks: "Daily" },
    pro: { urls: 5, checks: "Daily" },
    business: { urls: 25, checks: "Daily" },
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-electric-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <span className="text-xl font-bold">Page<span className="text-electric-400">Pulse</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Dashboard</Link>
          <button onClick={logout} className="text-slate-400 hover:text-white text-sm transition-colors">Logout</button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      {message && (
        <div className={`${message.type === "success" ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"} border rounded-xl px-4 py-3 mb-6`}>
          {message.text}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-electric-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Email Address</label>
              <input type="email" value={user?.email || ""} disabled className="w-full bg-navy-900/30 border border-white/5 rounded-lg px-4 py-2 text-slate-400 text-sm cursor-not-allowed" />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
            <button onClick={updateProfile} disabled={saving} className="bg-electric-500 hover:bg-electric-600 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-electric-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25m-5.25 3h5.25m-5.25 3h5.25M3.375 5.25c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
            </svg>
            Subscription
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Current Plan</span>
              <span className={`${planColors[user?.plan || "free"]} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>{user?.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">URL Limit</span>
              <span className="text-white font-medium">{planLimits[user?.plan || "free"].urls === Infinity ? "Unlimited" : planLimits[user?.plan || "free"].urls}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Check Frequency</span>
              <span className="text-white font-medium">{planLimits[user?.plan || "free"].checks}</span>
            </div>
            {user?.plan !== "free" && (
              <div className="pt-4 border-t border-white/10">
                <button onClick={cancelSubscription} disabled={cancelling} className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">
                  {cancelling ? "Cancelling..." : "Cancel Subscription"}
                </button>
                <p className="text-xs text-slate-500 mt-2">You'll keep access until the end of your billing period</p>
              </div>
            )}
            {user?.plan === "free" && (
              <div className="pt-4 border-t border-white/10">
                <Link href="/#pricing" className="block w-full text-center bg-electric-500 hover:bg-electric-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">Upgrade Plan</Link>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-electric-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            Usage Statistics
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-navy-900/30 rounded-xl">
              <p className="text-2xl font-bold text-white">{stats.urlsMonitored}</p>
              <p className="text-xs text-slate-400 mt-1">URLs Monitored</p>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl">
              <p className="text-2xl font-bold text-white">{stats.changesDetected}</p>
              <p className="text-xs text-slate-400 mt-1">Changes Detected</p>
            </div>
            <div className="text-center p-4 bg-navy-900/30 rounded-xl">
              <p className="text-2xl font-bold text-white">{user?.plan === "free" ? "1" : user?.plan === "pro" ? "5" : "25"}</p>
              <p className="text-xs text-slate-400 mt-1">URL Limit</p>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-electric-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Account Security
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-slate-400">Password management is handled through Supabase Auth.</p>
            <Link href="/auth/reset-password" className="inline-block text-electric-400 hover:text-electric-300 text-sm transition-colors">
              Reset Password →
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-electric-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
            Billing History
          </h2>
          <div className="text-center py-8 text-slate-500">
            <p>Billing history will appear here once you have invoices.</p>
            {user?.plan !== "free" && (
              <p className="text-sm mt-2">Manage billing in your <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="text-electric-400 hover:text-electric-300">Stripe Dashboard</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}