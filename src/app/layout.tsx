import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { AnalyticsScript } from "../components/AnalyticsScript";

export const metadata: Metadata = {
  metadataBase: new URL("https://pagepulse.dev"),
  title: {
    default: "PagePulse — AI-Powered Website Change Monitoring & Competitor Intelligence",
    template: "%s | PagePulse",
  },
  description:
    "Monitor competitor websites with AI. PagePulse detects changes, filters noise, and delivers intelligence reports that tell you WHAT changed and WHY it matters.",
  keywords: [
    "website monitoring",
    "competitor intelligence",
    "website change detection",
    "AI monitoring",
    "competitor tracking",
    "SEO monitoring",
    "pricing intelligence",
    "website diff",
  ],
  authors: [{ name: "PagePulse" }],
  creator: "PagePulse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pagepulse.eu",
    siteName: "PagePulse",
    title: "PagePulse — AI-Powered Website Change Monitoring",
    description:
      "Know when your competitors change — before they know you're watching. AI-powered website monitoring that tells you WHAT changed and WHY it matters.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PagePulse — AI Website Change Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PagePulse — AI-Powered Website Change Monitoring",
    description:
      "Monitor competitor websites with AI. Detect changes, filter noise, get intelligence reports.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PagePulse",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered website change monitoring and competitor intelligence platform. Track competitor websites, detect meaningful changes, and receive AI-generated intelligence reports.",
  url: "https://pagepulse.eu",
  offers: [
    {
      "@type": "Offer",
      name: "Free",
      price: "0",
      priceCurrency: "USD",
      description: "Monitor up to 1 URL with daily checks",
    },
    {
      "@type": "Offer",
      name: "Pro",
      price: "4.99",
      priceCurrency: "USD",
      billingDuration: "P1M",
      description: "Monitor up to 5 URLs with daily checks and AI analysis",
    },
    {
      "@type": "Offer",
      name: "Business",
      price: "14.99",
      priceCurrency: "USD",
      billingDuration: "P1M",
      description: "Monitor up to 25 URLs with daily checks and priority support",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "142",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-navy-900 text-white antialiased">
        <AnalyticsScript />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
