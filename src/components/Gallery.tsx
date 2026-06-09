const cards = [
  { title: "Garage", desc: "The classic — high-gloss, hot-tire-proof, built to impress." },
  { title: "Basement", desc: "Transform cold concrete into a finished living space." },
  { title: "Pool Deck", desc: "Slip-resistant, UV-stable, beautiful around the water." },
  { title: "Sidewalk", desc: "Curb appeal that lasts. Seal and protect every walkway." },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative bg-ink py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-orange text-sm font-semibold tracking-widest uppercase mb-3">
            Gallery
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-cream tracking-tight leading-tight">
            Every surface.{" "}
            <span className="font-serif italic text-cream/80">Every detail.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, i) => (
            <div key={i} className="gallery-card group">
              {/* SWAP POINT: replace this placeholder with a real <Image> */}
              <div className="absolute inset-0 bg-gradient-to-br from-ink2 to-navy flex items-center justify-center">
                <span className="text-cream/20 text-sm font-medium">
                  Replace with install photo
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <h3 className="text-lg font-bold text-cream">{c.title}</h3>
                <p className="mt-1 text-sm text-cream/60">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
