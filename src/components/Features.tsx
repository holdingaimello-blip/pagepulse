const features = [
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "Smart Change Detection",
    description:
      "Go beyond simple text diffs. PagePulse understands page structure and detects meaningful changes in pricing, features, messaging, and layout — even when the HTML is completely restructured.",
    highlights: [
      "Structural page analysis",
      "Price change alerts",
      "New feature detection",
      "Content shift tracking",
    ],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
        />
      </svg>
    ),
    title: "AI Noise Filtering",
    description:
      "Cookie banners updated? Timestamp changed? Tracking pixel swapped? PagePulse's AI filters out meaningless changes so you only get alerts about updates that actually matter to your business.",
    highlights: [
      "Ignores cosmetic updates",
      "Filters tracking changes",
      "Skips ad rotations",
      "Zero false positives",
    ],
  },
  {
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
    title: "Competitor Intelligence Reports",
    description:
      "Get weekly AI-generated intelligence briefs that summarize all competitor activity. Understand market trends, pricing shifts, and strategic moves at a glance — delivered straight to your inbox.",
    highlights: [
      "Weekly AI summaries",
      "Trend analysis",
      "Strategic insights",
      "Email + Slack delivery",
    ],
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-electric-400 font-semibold text-sm uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to stay ahead
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            PagePulse combines intelligent monitoring with AI analysis to give
            you a competitive edge that&apos;s always on.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-8 hover:bg-white/[0.07] transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-electric-500/10 rounded-xl flex items-center justify-center text-electric-400 mb-6 group-hover:bg-electric-500/20 transition-colors">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>

              {/* Description */}
              <p className="text-slate-400 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {feature.highlights.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <svg
                      className="w-4 h-4 text-electric-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
