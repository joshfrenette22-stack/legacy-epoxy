import Nav from "@/components/Nav";
import HeroCanvas from "@/components/HeroCanvas";
import StatRow from "@/components/StatRow";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Gallery from "@/components/Gallery";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroCanvas />
        <StatRow />
        <Features />
        <HowItWorks />
        <Gallery />

        {/* Quote section */}
        <section id="quote" className="relative bg-ink2 py-20 md:py-28">
          <div className="mx-auto max-w-2xl px-5 md:px-8">
            <div className="text-center mb-12">
              <p className="text-orange text-sm font-semibold tracking-widest uppercase mb-3">
                Free Quote
              </p>
              <h2 className="text-3xl md:text-5xl font-bold text-cream tracking-tight leading-tight">
                Ready for a floor{" "}
                <span className="font-serif italic text-cream/80">
                  worth showing off?
                </span>
              </h2>
              <p className="mt-4 text-lg text-cream/50">
                Tell us about your project. No obligation — just an honest
                price.
              </p>
            </div>
            <QuoteForm />
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
