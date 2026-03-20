"use client";

import { useState } from "react";
import type { Metadata } from "next";

interface MonitoredUrl {
  id: string;
  url: string;
  lastChecked: string;
  status: "changed" | "unchanged" | "pending";
  summary: string;
}

const initialMockData: MonitoredUrl[] = [
  {
    id: "1",
    url: "https://competitor-a.com/pricing",
    lastChecked: "2026-03-20T13:45:00Z",
    status: "changed",
    summary:
      "Pricing page updated: Enterprise tier increased from $99/mo to $129/mo. New 'Startup' plan added at $29/mo with limited features. Free trial extended from 7 to 14 days.",
  },
  {
    id: "2",
    url: "https://competitor-b.io/features",
    lastChecked: "2026-03-20T12:30:00Z",
    status: "unchanged",
    summary: "No meaningful changes detected since last check.",
  },
  {
    id: "3",
    url: "https://rival-saas.com/blog",
    lastChecked: "2026-03-20T11:00:00Z",
    status: "changed",
    summary:
      'New blog post published: "Announcing Our Series B: $25M to Redefine Workflow Automation." Post mentions expansion into European markets and hiring 50+ engineers.',
  },
  {
    id: "4",
    url: "https://market-leader.com/product",
    lastChecked: "2026-03-20T10:15:00Z",
    status: "changed",
    summary:
      "Product page restructured. New AI-powered feature 'SmartSync' prominently displayed. Previous hero section replaced with interactive demo. Integration list expanded with 12 new tools.",
  },
];

function StatusBadge({ status }: { status: MonitoredUrl["status"] }) {
  const styles = {
    changed:
      "bg-amber-500/20 text-amber-400 border-amber-500/30",
    unchanged:
      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    pending:
      "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  const labels = {
    changed: "Changed",
    unchanged: "Unchanged",
    pending: "Pending",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "changed"
            ? "bg-amber-400"
            : status === "unchanged"
            ? "bg-emerald-400"
            : "bg-slate-400"
        }`}
      />
      {labels[status]}
    </span>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [urls, setUrls] = useState<MonitoredUrl[]>(initialMockData);
  const [newUrl, setNewUrl] = useState("");
  const [checking, setChecking] = useState<string | null>(null);

  function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const entry: MonitoredUrl = {
      id: Date.now().toString(),
      url: newUrl.trim().startsWith("http")
        ? newUrl.trim()
        : `https://${newUrl.trim()}`,
      lastChecked: new Date().toISOString(),
      status: "pending",
      summary: "Waiting for first check...",
    };

    setUrls((prev) => [entry, ...prev]);
    setNewUrl("");
  }

  async function handleCheck(id: string) {
    const entry = urls.find((u) => u.id === id);
    if (!entry) return;

    setChecking(id);

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: entry.url }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();

      setUrls((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                lastChecked: data.timestamp,
                status: data.changed ? "changed" : "unchanged",
                summary: data.summary,
              }
            : u
        )
      );
    } catch (err) {
      setUrls((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
                ...u,
                lastChecked: new Date().toISOString(),
                summary: `Error checking URL: ${
                  err instanceof Error ? err.message : "Unknown error"
                }`,
              }
            : u
        )
      );
    } finally {
      setChecking(null);
    }
  }

  function handleRemove(id: string) {
    setUrls((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="min-h-screen pt-20">
      {/* JSON-LD for dashboard */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "PagePulse Dashboard",
            url: "https://pagepulse.dev/dashboard",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
          }),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Monitoring Dashboard</h1>
          <p className="text-slate-400">
            Track your competitor URLs and get AI-powered change intelligence.
          </p>
        </div>

        {/* Add URL Form */}
        <form
          onSubmit={handleAddUrl}
          className="glass-card p-6 mb-8 flex flex-col sm:flex-row gap-4"
        >
          <div className="flex-1">
            <label htmlFor="url-input" className="sr-only">
              URL to monitor
            </label>
            <input
              id="url-input"
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Enter URL to monitor (e.g., competitor.com/pricing)"
              className="w-full bg-navy-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="bg-electric-500 hover:bg-electric-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            + Add URL
          </button>
        </form>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-electric-400">
              {urls.length}
            </div>
            <div className="text-sm text-slate-400">Monitored URLs</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">
              {urls.filter((u) => u.status === "changed").length}
            </div>
            <div className="text-sm text-slate-400">Changes Detected</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {urls.filter((u) => u.status === "unchanged").length}
            </div>
            <div className="text-sm text-slate-400">Unchanged</div>
          </div>
        </div>

        {/* URL List */}
        <div className="space-y-4">
          {urls.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No URLs monitored yet</h3>
              <p className="text-slate-400">
                Add a competitor URL above to start monitoring for changes.
              </p>
            </div>
          ) : (
            urls.map((entry) => (
              <div key={entry.id} className="glass-card p-6 hover:bg-white/[0.07] transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge status={entry.status} />
                      <span className="text-xs text-slate-500">
                        Last checked: {formatDate(entry.lastChecked)}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-white truncate mb-2">
                      {entry.url}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {entry.summary}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleCheck(entry.id)}
                      disabled={checking === entry.id}
                      className="bg-electric-500/20 hover:bg-electric-500/30 text-electric-400 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {checking === entry.id ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Checking...
                        </span>
                      ) : (
                        "Check Now"
                      )}
                    </button>
                    <button
                      onClick={() => handleRemove(entry.id)}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                      title="Remove URL"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
