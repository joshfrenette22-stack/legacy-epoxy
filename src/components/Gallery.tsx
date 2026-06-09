const cards = [
  { title: "Garage", desc: "The classic — high-gloss, hot-tire-proof, built to impress." },
  { title: "Basement", desc: "Transform cold concrete into a finished living space." },
  { title: "Pool Deck", desc: "Slip-resistant, UV-stable, beautiful around the water." },
  { title: "Sidewalk", desc: "Curb appeal that lasts. Seal and protect every walkway." },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0d1117 0%, #151c26 50%, #0d1117 100%)" }}>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-16 md:mb-24" data-reveal>
          <p className="text-orange text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Gallery
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-cream tracking-tight leading-tight">
            Every surface.{" "}
            <span className="font-serif italic text-cream/80">Every detail.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <div key={i} className="gallery-card group cursor-pointer" data-scale-in>
              {/* SWAP POINT: replace with real <Image> */}
              <div className="absolute inset-0 bg-gradient-to-br from-ink2 to-navy flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <span className="text-cream/20 text-xs font-medium px-4 text-center">
                  Replace with install photo
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold text-cream">{c.title}</h3>
                <p className="mt-1 text-sm text-cream/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
