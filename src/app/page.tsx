import Nav from "@/components/Nav";
import HeroCanvas from "@/components/HeroCanvas";
import ChemTecSection from "@/components/ChemTecSection";
import StatRow from "@/components/StatRow";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Nav />
      <main>
        <HeroCanvas />
        <ChemTecSection />
        <StatRow />
        <Features />
        <HowItWorks />
        <Gallery />

        {/* Quote section */}
        <section id="quote" className="relative py-24 md:py-32 overflow-hidden"
          style={{ background: "var(--color-paper)" }}>
          <div className="mx-auto max-w-2xl px-5 md:px-8">
            <div className="text-center mb-14" data-reveal>
              <p className="text-orange text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Free Quote
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-tight">
                Ready for a floor{" "}
                <span className="font-serif italic text-orange">
                  worth showing off?
                </span>
              </h2>
              <p className="mt-5 text-lg text-ink/45 max-w-lg mx-auto">
                Tell us about your project. No obligation — just an honest
                price.
              </p>
            </div>
            <div data-reveal>
              <QuoteForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
