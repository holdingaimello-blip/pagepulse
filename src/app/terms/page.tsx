import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PagePulse Terms of Service - Rules and guidelines for using our website monitoring service.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Terms of Service",
  "description": "PagePulse Terms of Service",
  "url": "https://pagepulse.eu/terms",
  "dateModified": "2025-03-23",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-electric-400 hover:text-electric-300 text-sm mb-8 inline-block">← Back to Home</Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: March 23, 2025</p>

        <div className="prose prose-invert prose-slate max-w-none">
          <p>Please read these Terms of Service carefully before using PagePulse. By accessing or using our service, you agree to be bound by these Terms.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By creating an account or using PagePulse, you agree to these Terms and our Privacy Policy.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
          <p>PagePulse provides AI-powered website monitoring including: automated change detection, AI summaries, competitor monitoring, notifications, and weekly reports.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Registration</h2>
          <p>You must be at least 18 years old and provide accurate information. You are responsible for maintaining your account security.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription and Payments</h2>
          <p>Free Plan: 3 URLs, daily checks. Pro Plan: $19/month, 25 URLs, hourly checks. Business Plan: $49/month, unlimited URLs, real-time monitoring. Payments via Stripe. Cancel anytime.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Acceptable Use</h2>
          <p>Do not use PagePulse for illegal purposes, to circumvent security, or monitor sites without rights. Do not resell our data.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
          <p>PagePulse and its content are our property. You retain rights to your monitored URLs and data.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>PagePulse is provided "as is". We are not liable for missed changes or damages from using our service.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>
          <p>We may suspend or terminate accounts for violations. You may delete your account anytime.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
          <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact</h2>
          <p>Questions? Contact us at <a href="mailto:hello@pagepulse.eu" className="text-electric-400 hover:text-electric-300">hello@pagepulse.eu</a>.</p>
        </div>
      </div>
    </div>
  );
}
