"use client";

import { useState } from "react";
import Link from "next/link";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({ success: true, message: "Message sent! We'll get back to you soon." });
        setFormData({ email: "", subject: "", message: "" });
      } else {
        setResult({ success: false, message: data.error || "Something went wrong." });
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/" className="text-electric-400 hover:text-electric-300 text-sm mb-8 inline-block">← Back to Home</Link>
        
        <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
        <p className="text-slate-400 mb-8">Have a question? We're here to help.</p>

        {result && (
          <div className={`${result.success ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"} border rounded-xl px-4 py-3 mb-6`}>
            {result.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Subject</label>
            <select
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-electric-500"
            >
              <option value="">Select a topic...</option>
              <option value="billing">Billing & Subscription</option>
              <option value="technical">Technical Issue</option>
              <option value="feature">Feature Request</option>
              <option value="account">Account Help</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-navy-900/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-electric-500 resize-none"
              placeholder="Describe your issue or question..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-electric-500 hover:bg-electric-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-slate-400 text-sm">Prefer email? Reach us at{" "}
            <a href="mailto:support@pagepulse.eu" className="text-electric-400 hover:text-electric-300">support@pagepulse.eu</a>
          </p>
        </div>
      </div>
    </div>
  );
}
