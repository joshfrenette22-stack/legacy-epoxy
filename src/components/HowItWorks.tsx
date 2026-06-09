const steps = [
  {
    num: "01",
    title: "Free Quote",
    desc: "Tell us about your space. We'll come measure, discuss options, and give you an honest price — no pressure.",
  },
  {
    num: "02",
    title: "Surface Prep",
    desc: "We diamond-grind the concrete to create a mechanical bond. No shortcuts, no acid wash. This is what separates a pro job.",
  },
  {
    num: "03",
    title: "Certified Install",
    desc: "Multi-coat ChemTec system applied by the region's only certified crew. Broadcast, seal, cure — done right.",
  },
  {
    num: "04",
    title: "10-Year Warranty",
    desc: "Walk on it in 24 hours. Drive on it in 72. Backed by a written 10-year warranty you won't find anywhere else.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="process"
      className="relative py-20 md:py-28"
      style={{ background: "var(--color-cream)", color: "var(--color-navy)" }}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-orange text-sm font-semibold tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Four steps to a{" "}
            <span className="font-serif italic">finished surface.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {steps.map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <span className="text-5xl md:text-6xl font-bold text-orange/20 leading-none">
                {s.num}
              </span>
              <h3 className="mt-3 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed opacity-70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
