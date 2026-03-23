import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PagePulse Privacy Policy - How we collect, use, and protect your data.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Privacy Policy",
  "description": "PagePulse Privacy Policy",
  "url": "https://pagepulse.eu/privacy",
  "dateModified": "2025-03-23",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-electric-400 hover:text-electric-300 text-sm mb-8 inline-block">← Back to Home</Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: March 23, 2025</p>

        <div className="prose prose-invert prose-slate max-w-none">
          <p>At PagePulse, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website monitoring and competitor intelligence service.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-medium mt-6 mb-3">Personal Information</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Email address</li>
            <li>Name (optional)</li>
            <li>Billing information (processed securely by Stripe)</li>
            <li>IP address and browser information</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-3">Usage Data</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>URLs you choose to monitor</li>
            <li>Change detection history</li>
            <li>AI-generated summaries</li>
            <li>Notification preferences</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Provide and maintain our website monitoring service</li>
            <li>Process payments and manage subscriptions</li>
            <li>Send notifications about website changes</li>
            <li>Send weekly intelligence reports (if subscribed)</li>
            <li>Improve our AI algorithms and service quality</li>
            <li>Respond to support requests</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Storage and Security</h2>
          <p>We use Supabase for secure data storage. All data is encrypted in transit and at rest. We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li><strong>Stripe</strong> - Payment processing (PCI DSS compliant)</li>
            <li><strong>Supabase</strong> - Database and authentication</li>
            <li><strong>OpenAI</strong> - AI-powered change analysis</li>
            <li><strong>Vercel</strong> - Hosting and infrastructure</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights (GDPR/CCPA)</h2>
          <p>Depending on your location, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Export your data</li>
            <li>Object to data processing</li>
            <li>Withdraw consent</li>
          </ul>
          <p className="mt-4">To exercise these rights, contact us at <a href="mailto:privacy@pagepulse.eu" className="text-electric-400 hover:text-electric-300">privacy@pagepulse.eu</a>.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
          <p>We retain your data for as long as your account is active. Upon account deletion, we will delete your personal data within 30 days, except where required by law to retain certain information.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies</h2>
          <p>We use essential cookies for authentication and session management. We do not use tracking cookies for advertising purposes.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-disc pl-6 space-y-2 text-slate-300">
            <li>Email: <a href="mailto:privacy@pagepulse.eu" className="text-electric-400 hover:text-electric-300">privacy@pagepulse.eu</a></li>
            <li>Address: PagePulse, EU</li>
          </ul>
        </div>
      </div>
    </div>
  );
}