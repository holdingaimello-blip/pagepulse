"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function Navbar() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowser();
    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) setUser({ email: u.email || undefined });
    });
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Page<span className="text-electric-400">Pulse</span></span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-slate-300 hover:text-white text-sm transition-colors">Features</Link>
            <Link href="/#pricing" className="text-slate-300 hover:text-white text-sm transition-colors">Pricing</Link>
            {user ? (
              <Link href="/dashboard" className="bg-electric-500 hover:bg-electric-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="text-slate-300 hover:text-white text-sm transition-colors">Login</Link>
                <Link href="/auth/signup" className="bg-electric-500 hover:bg-electric-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-300 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-white/5">
            <Link href="/#features" className="block text-slate-300 hover:text-white text-sm">Features</Link>
            <Link href="/#pricing" className="block text-slate-300 hover:text-white text-sm">Pricing</Link>
            {user ? (
              <Link href="/dashboard" className="block bg-electric-500 text-white font-medium px-4 py-2 rounded-lg text-sm text-center">Dashboard</Link>
            ) : (
              <>
                <Link href="/auth/login" className="block text-slate-300 hover:text-white text-sm">Login</Link>
                <Link href="/auth/signup" className="block bg-electric-500 text-white font-medium px-4 py-2 rounded-lg text-sm text-center">Sign Up Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
