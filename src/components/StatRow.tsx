const stats = [
  { value: "10-Year", label: "Warranty", sub: "On every install" },
  { value: "1 of 1", label: "Certified ChemTec", sub: "Only installer in the region" },
  { value: "4", label: "Surfaces", sub: "Garage · Basement · Pool deck · Sidewalk" },
];

export default function StatRow() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden"
      style={{ background: "var(--color-cream)" }}>
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 text-center" data-stagger>
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-orange tracking-tight" data-count>
                {s.value}
              </span>
              <span className="mt-2 text-lg font-semibold text-ink">
                {s.label}
              </span>
              <span className="mt-1 text-sm text-ink/50">{s.sub}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 h-px bg-ink/[0.08]" data-line />
      </div>
    </section>
  );
}
