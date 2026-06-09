const stats = [
  { value: "10-Year", label: "Warranty", sub: "On every install" },
  { value: "1 of 1", label: "Certified ChemTec", sub: "Only installer in the region" },
  { value: "4", label: "Surfaces", sub: "Garage · Basement · Pool deck · Sidewalk" },
];

export default function StatRow() {
  return (
    <section className="relative bg-ink2 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-bold text-orange tracking-tight">
                {s.value}
              </span>
              <span className="mt-2 text-lg font-semibold text-cream">
                {s.label}
              </span>
              <span className="mt-1 text-sm text-cream/50">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
