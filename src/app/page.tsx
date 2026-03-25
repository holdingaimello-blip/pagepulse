import Hero from "@/components/Hero";
import HeroVariantB from "@/components/HeroVariantB";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";

// A/B Test: 50/50 split based on random
export default function Home() {
  const useVariantB = Math.random() > 0.5;

  return (
    <>
      {useVariantB ? <HeroVariantB /> : <Hero />}
      <Features />
      <Pricing />
    </>
  );
}
