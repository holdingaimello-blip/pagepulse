"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

interface MonitoredUrl {
  id: string;
  url: string;
  last_checked_at: string | null;
  status: string;
}

interface Change {
  id: string;
  ai_summary: string | null;
  detected_at: string;
}

interface UserData {
  id: string;
  email: string;
  plan: string;
  url_limit: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [urls, setUrls] = useState<MonitoredUrl[]>([]);
  const [changes, setChanges] = useState<Record<string, Change[]>>({});
  const [notifCount, setNotifCount] = useState(0);
  const [newUrl, setNewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const supabase = createSupabaseBrowser();

  const loadData = useCallback(async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser?.email) {
      window.location.href = "/auth/login";
      return;
    }

    // Get or create user record
    let { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("email", authUser.email)
      .single();

    if (!userData) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({ email: authUser.email, plan: "free", url_limit: 1, check_interval_minutes: 1440 })
        .select()
        .single();
      userData = newUser;
    }

    if (!userData) return;
    setUser(userData as UserData);

    // Fetch URLs
    const { data: urlData } = await supabase
      .from("monitored_urls")
      .select("*")
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    const fetchedUrls = (urlData || []) as MonitoredUrl[];
    setUrls(fetchedUrls);

    // Fetch changes for each URL
    const changesMap: Record<string, Change[]> = {};
    for (const u of fetchedUrls) {
      const { data: changeData } = await supabase
        .from("changes")
        .select("id, ai_summary, detected_at")
        .eq("monitored_url_id", u.id)
        .order("detected_at", { ascending: false })
        .limit(3);
      if (changeData) changesMap[u.id] = changeData as Change[];
    }
    setChanges(changesMap);

    // Notification count
    const { count } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userData.id)
      .eq("read", false);
    setNotifCount(count || 0);

    setLoading(false);
  }, [supabase]);

  useEffect(() => { loadData(); }, [loadData]);

  async function addUrl() {
    if (!newUrl || !user) return;
    if (urls.length >= user.url_limit) {
      setError(`URL limit reached (${user.url_limit}). Upgrade your plan.`);
      return;
    }
    setError(null);
    const { error: insertError } = await supabase
      .from("monitored_urls")
      .insert({ user_id: user.id, url: newUrl, status: "active" });
    if (insertError) { setError(insertError.message); return; }
    setNewUrl("");
    loadData();
  }

  async function removeUrl(id: string) {
    await supabase.from("monitored_urls").delete().eq("id", id);
    loadData();
  }

  async function checkUrl(url: string, id: string) {
    setChecking(id);
    try {
      await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      loadData();
    } catch { /* ignore */ }
    setChecking(null);
  }

  async function cancelSubscription() {
    if (!confirm("Cancel subscription? You'll be downgraded to Free.")) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      if (res.ok) loadData();
      else setError("Failed to cancel subscription");
    } catch { setError("Failed to cancel subscription"); }
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

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
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
          {notifCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{notifCount}</span>
          )}
          <span className={`${planColors[user?.plan || "free"]} text-white text-xs font-bold px-3 py-1 rounded-full uppercase`}>
            {user?.plan}
          </span>
          <span className="text-slate-400 text-sm hidden md:block">{user?.email}</span>
          <button onClick={logout} className="text-slate-400 hover:text-white text-sm transition-colors">Logout</button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="glass-card rounded-xl p-4 mb-6 flex items-center justify-between">
        <span className="text-slate-300 text-sm">
          URLs: <span className="text-white font-bold">{urls.length}</span> / {user?.url_limit}
        </span>
        {user?.plan !== "free" && (
          <button
            onClick={cancelSubscription}
            disabled={cancelling}
            className="text-red-400 hover:text-red-300 text-xs transition-colors"
          >
            {cancelling ? "Cancelling..." : "Cancel Subscription"}
          </button>
        )}
        {user?.plan === "free" && (
          <Link href="/#pricing" className="text-electric-400 hover:text-electric-300 text-xs font-medium transition-colors">
            Upgrade Plan →
          </Link>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
          <button onClick={() => setError(null)} className="float-right text-red-400 hover:text-red-300">×</button>
        </div>
      )}

      {/* Add URL */}
      <div className="glass-card rounded-xl p-4 mb-6 flex gap-3">
        <input
          type="url"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://competitor.com/pricing"
          className="flex-1 bg-navy-900/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-500 text-sm"
          onKeyDown={(e) => e.key === "Enter" && addUrl()}
        />
        <button
          onClick={addUrl}
          disabled={!newUrl || urls.length >= (user?.url_limit || 3)}
          className="bg-electric-500 hover:bg-electric-600 text-white font-medium px-5 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          Add URL
        </button>
      </div>

      {/* URLs list */}
      {urls.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-slate-400 mb-2">No URLs monitored yet</p>
          <p className="text-slate-500 text-sm">Add a competitor URL above to start tracking changes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {urls.map((u) => (
            <div key={u.id} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <a href={u.url} target="_blank" rel="noopener noreferrer" className="text-electric-400 hover:text-electric-300 text-sm font-medium truncate max-w-md transition-colors">
                  {u.url}
                </a>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => checkUrl(u.url, u.id)}
                    disabled={checking === u.id}
                    className="text-slate-400 hover:text-white text-xs border border-white/10 rounded-lg px-3 py-1 transition-colors disabled:opacity-50"
                  >
                    {checking === u.id ? "Checking..." : "Check Now"}
                  </button>
                  <button
                    onClick={() => removeUrl(u.id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              {u.last_checked_at && (
                <p className="text-slate-500 text-xs mb-2">Last checked: {new Date(u.last_checked_at).toLocaleString()}</p>
              )}
              {/* Change history */}
              {changes[u.id]?.length > 0 && (
                <div className="mt-3 space-y-2">
                  {changes[u.id].map((c) => (
                    <div key={c.id} className="bg-navy-900/50 rounded-lg p-3 border border-white/5">
                      <p className="text-xs text-slate-500 mb-1">{new Date(c.detected_at).toLocaleString()}</p>
                      <p className="text-sm text-slate-300">{c.ai_summary || "Change detected"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
