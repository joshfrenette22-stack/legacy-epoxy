"use client";

import { useEffect, useRef, useState } from "react";

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
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section top enters viewport, 1 when section is fully in view
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height * 0.3)));
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const blur = Math.max(0, 12 - progress * 12);
  const scale = 1.08 - progress * 0.08;

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ background: "var(--color-cream)", color: "var(--color-navy)" }}
    >
      {/* Full-width background image with aperture blur effect */}
      <img
        ref={imgRef}
        src="/images/epoxy-surface-bg.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          opacity: 0.45,
          filter: `blur(${blur}px)`,
          transform: `scale(${scale})`,
          transition: "filter 0.1s ease-out, transform 0.1s ease-out",
          willChange: "filter, transform",
        }}
      />
      {/* Cream overlay for readability */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(250,247,241,0.7) 0%, rgba(250,247,241,0.5) 50%, rgba(250,247,241,0.7) 100%)" }} />

      <div className="mx-auto max-w-6xl px-5 md:px-8 relative">
        <div className="text-center mb-16 md:mb-24" data-reveal>
          <p className="text-orange text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Four steps to a{" "}
            <span className="font-serif italic text-orange">finished surface.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8" data-stagger>
          {steps.map((s, i) => (
            <div key={i} className="text-center md:text-left">
              <span className="text-6xl md:text-7xl font-bold text-orange/15 leading-none block">
                {s.num}
              </span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-base leading-relaxed opacity-60">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block mt-6 h-px bg-navy/10" data-line />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
