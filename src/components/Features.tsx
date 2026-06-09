const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 7.66l-.71-.71M4.05 4.05l-.71-.71" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    title: "Mirror-Gloss Depth",
    desc: "Multi-layer ChemTec system builds a deep, reflective finish that makes your floor look like polished stone.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M17.5 19.5L12 14l-5.5 5.5M12 14V3" />
        <path d="M3 21h18" />
      </svg>
    ),
    title: "Hot-Tire Proof",
    desc: "Won't peel, yellow, or lift — even after years of hot tires pulling in every day.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M8 12l3 3 5-5" />
      </svg>
    ),
    title: "Stain & Chemical Resistant",
    desc: "Oil, salt, gasoline, brake fluid — wipe it up. The coating shrugs off everything a garage can throw at it.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M4 20l4.5-4.5M9 15l2 2M12 6l-2 6 6-2-4-4z" />
        <path d="M20 4l-8 8" />
      </svg>
    ),
    title: "Slip-Resistant Surface",
    desc: "Textured broadcast layer gives solid grip in wet or dry conditions — safe for the whole family.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--color-paper)" }}>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-16 md:mb-24" data-reveal>
          <p className="text-orange text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Why Legacy Epoxy
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-tight">
            Built different.{" "}
            <span className="font-serif italic text-orange">Built to last.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8" data-stagger>
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-ink/[0.06] bg-white/60 p-8 md:p-10 transition-all duration-300 hover:bg-white/80 hover:border-ink/[0.1] hover:shadow-lg group"
            >
              <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange/10 text-orange transition-transform duration-300 group-hover:scale-110">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-ink mb-3">{f.title}</h3>
              <p className="text-base text-ink/55 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
