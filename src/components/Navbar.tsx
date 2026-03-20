"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-navy-900/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-electric-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold">
              Page<span className="text-electric-400">Pulse</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/dashboard"
              className="text-sm text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-electric-500 hover:bg-electric-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-navy-800 border-b border-white/5">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-sm text-slate-300 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-sm text-slate-300 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <Link
              href="/dashboard"
              className="block text-sm text-slate-300 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="block bg-electric-500 hover:bg-electric-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors text-center"
              onClick={() => setMobileOpen(false)}
            >
              Start Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
