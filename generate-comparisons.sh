#!/bin/bash

competitors=(
  "distill:Distill.io"
  "hexowatch:Hexowatch" 
  "wachete:Wachete"
  "prisync:Prisync"
  "price2spy:Price2Spy"
  "competera:Competera"
  "minderest:Minderest"
  "intelligencenode:Intelligence Node"
  "skuudle:Skuudle"
  "pricebeam:PriceBeam"
)

for comp in "${competitors[@]}"; do
  slug="${comp%%:*}"
  name="${comp##*:}"
  
  mkdir -p "/home/ubuntu/.openclaw/workspace/pagepulse-v2/src/app/compare/$slug"
  
  cat > "/home/ubuntu/.openclaw/workspace/pagepulse-v2/src/app/compare/$slug/page.tsx" << INNEREOF
export default function Page() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', color: 'white', backgroundColor: '#0f172a' }}>
      <h1>PagePulse vs $name: Competitor Intelligence Comparison</h1>
      <p>See why teams are switching from $name to PagePulse for AI-powered competitor monitoring.</p>
      
      <h2>Key Advantages</h2>
      <ul>
        <li>✅ AI-powered change analysis</li>
        <li>✅ Noise filtering (no spam alerts)</li>
        <li>✅ Strategic intelligence reports</li>
        <li>✅ 10x cheaper than $name</li>
      </ul>
      
      <a href="https://pagepulse-v2.vercel.app?utm_source=compare&utm_medium=seo&utm_campaign=vs-$slug" 
         style={{ display: 'inline-block', backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none' }}>
        Start Free →
      </a>
    </div>
  );
}

export const metadata = {
  title: 'PagePulse vs $name: Better Competitor Monitoring 2026',
  description: 'Compare PagePulse vs $name. AI-powered competitor intelligence with strategic insights.',
};
INNEREOF

done

echo "Generated ${#competitors[@]} comparison pages"
