"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = "9705551234"; // TODO: replace with real number

const CALLOUTS = [
  { label: "Diamond Blade Prepped", x: 18, y: 72 },
  { label: "Hot-Tire Proof", x: 75, y: 68 },
  { label: "Chemical Resistant", x: 28, y: 45 },
  { label: "Mirror-Gloss Finish", x: 62, y: 82 },
  { label: "UV Stable", x: 82, y: 40 },
  { label: "10-Year Warranty", x: 50, y: 30 },
  { label: "Slip-Resistant", x: 38, y: 60 },
  { label: "Single-Day Install", x: 68, y: 52 },
];

export default function HeroCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const h3Ref = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect environment
  useEffect(() => {
    const isMobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMobile(isMobile);
    setMounted(true);
  }, []);

  // Desktop: ALL GSAP animations in one context — no video loading gate
  useEffect(() => {
    if (!mounted || mobile) return;
    const el = pinRef.current;
    const h1 = h1Ref.current;
    const h2 = h2Ref.current;
    const h3 = h3Ref.current;
    const fade = fadeRef.current;
    const callouts = calloutRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!el || !h1 || !h2 || !h3 || !fade || callouts.length === 0) return;

    const video = videoRef.current;
    const dur = (video?.duration && video.duration > 0) ? video.duration : 3.5;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // ── Entrance: fade h1 in on load (non-scroll) ──
        gsap.fromTo(h1,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.3 }
        );

        // ── Scroll-scrub timeline ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=500%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Video scrub — seeks even if video loads late
        if (video) {
          const o = { t: 0 };
          tl.to(o, {
            t: dur,
            duration: 0.55,
            ease: "none",
            onUpdate() {
              if (video.readyState >= 2 && Math.abs(video.currentTime - o.t) > 0.03) {
                video.currentTime = o.t;
              }
            },
          }, 0);
        }

        // PHASE 1: h1 fades out
        // immediateRender:false = don't touch h1 at scroll 0, let entrance anim play
        tl.fromTo(h1,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -30, duration: 0.08, ease: "power2.in", immediateRender: false },
          0.10
        );

        // PHASE 2: h2 in then out
        tl.fromTo(h2,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.24
        );
        tl.to(h2, { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.42);

        // PHASE 3: callouts stagger in
        tl.fromTo(h3, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.52);
        callouts.forEach((callout, i) => {
          tl.fromTo(callout,
            { opacity: 0, scale: 0, rotateX: -20 },
            { opacity: 1, scale: 1, rotateX: 0, duration: 0.05, ease: "back.out(1.7)" },
            0.54 + i * 0.025
          );
        });

        // Callouts out + dark→light
        tl.to(h3, { opacity: 0, duration: 0.05, ease: "power2.in" }, 0.82);
        tl.fromTo(fade, { opacity: 0 }, { opacity: 1, duration: 0.10, ease: "power1.inOut" }, 0.88);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [mounted, mobile]);

  // ── Mobile: simple static layout ──
  if (mounted && mobile) {
    return (
      <>
        <section className="relative flex items-center justify-center overflow-hidden"
          style={{ background: "#0d1117", minHeight: "100dvh" }}>
          <img
            src="/images/hero-poster.jpg"
            alt="Epoxy floor installation"
            className="absolute inset-0 w-full h-full object-cover z-[1] opacity-70"
          />
          <div className="absolute inset-x-0 top-0 h-32 z-[3] pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.85), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 h-40 z-[3] pointer-events-none"
            style={{ background: "linear-gradient(to top, #0d1117, transparent)" }} />

          <div className="relative z-10 text-center px-5 max-w-3xl mx-auto py-24" data-reveal>
            <div className="warranty-chip mx-auto mb-6">
              <span className="w-2 h-2 rounded-full bg-orange inline-block" />
              1 of 1 — Only certified ChemTec installer · 10-year warranty
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-cream tracking-tight leading-[1.1]">
              A garage floor <span className="font-serif italic">built to outlast</span> the house.
            </h1>
            <p className="mt-5 text-lg text-cream/70 font-bold">
              Not a coating. <span className="font-serif italic">A finished surface.</span>
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#quote" className="btn-pill btn-pill-primary text-base">Get a Free Quote</a>
              <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost text-base">Call Now</a>
            </div>
          </div>
        </section>

        <section className="py-12 px-5 overflow-hidden" style={{ background: "#0d1117" }}>
          <p className="text-orange text-xs font-semibold tracking-[0.2em] uppercase text-center mb-6">
            What Sets Us Apart
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto" data-stagger>
            {CALLOUTS.map((c) => (
              <span key={c.label} className="feature-pill text-xs">{c.label}</span>
            ))}
          </div>
        </section>
      </>
    );
  }

  // ── Desktop: full scroll-scrub ──
  return (
    <section
      ref={pinRef}
      className="relative overflow-hidden"
      style={{ background: "#0d1117", height: "100dvh" }}
    >
      <video
        ref={videoRef}
        src="/hero.mp4"
        muted
        playsInline
        preload="auto"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover z-[1]"
      />

      {/* Gradient overlays */}
      <div className="hero-gradient absolute inset-x-0 top-0 h-44 z-[3]"
        style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.85), transparent)" }} />
      <div className="hero-gradient absolute inset-x-0 bottom-0 h-56 z-[3]"
        style={{ background: "linear-gradient(to top, #0d1117, transparent)" }} />
      <div className="hero-gradient absolute inset-y-0 left-0 w-[18%] z-[2]"
        style={{ background: "linear-gradient(to right, rgba(13,17,23,0.65), transparent)" }} />
      <div className="hero-gradient absolute inset-y-0 right-0 w-[18%] z-[2]"
        style={{ background: "linear-gradient(to left, rgba(13,17,23,0.65), transparent)" }} />
      <div className="hero-gradient absolute inset-0 z-[2]"
        style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 50%, rgba(13,17,23,0.55) 100%)" }} />

      {/* Headline 1 — starts opacity-0, GSAP handles BOTH entrance + scroll-out */}
      <div ref={h1Ref} className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0" style={{ willChange: "opacity, transform" }}>
        <div className="pointer-events-auto">
          <div className="warranty-chip mb-6">
            <span className="w-2 h-2 rounded-full bg-orange inline-block" />
            1 of 1 — Only certified ChemTec installer · 10-year warranty
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
            A garage floor <span className="font-serif italic">built to outlast</span> the house.
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">Get a Free Quote</a>
            <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost text-base">Call Now</a>
          </div>
        </div>
      </div>

      {/* Headline 2 */}
      <div ref={h2Ref} className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0" style={{ willChange: "opacity, transform" }}>
        <div className="pointer-events-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
            Not a coating. <span className="font-serif italic">A finished surface.</span>
          </h2>
        </div>
      </div>

      {/* Phase 3: Callouts */}
      <div
        ref={h3Ref}
        className="absolute inset-0 z-[5] pointer-events-none opacity-0"
        style={{ perspective: "1200px", willChange: "opacity" }}
      >
        <div className="absolute inset-0 bg-ink/30" />
        <div className="absolute top-[12%] left-1/2 -translate-x-1/2 text-center z-10">
          <p className="text-orange text-xs md:text-sm font-semibold tracking-[0.2em] uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            What Sets Us Apart
          </p>
        </div>

        {CALLOUTS.map((c, i) => (
          <div
            key={c.label}
            ref={(el) => { calloutRefs.current[i] = el; }}
            className="callout-3d absolute pointer-events-auto opacity-0"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: "translate(-50%, -50%)",
              willChange: "opacity, transform",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-3 h-3 rounded-full bg-orange shadow-[0_0_12px_rgba(232,99,26,0.6)]" />
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-px h-4 bg-gradient-to-b from-orange/80 to-transparent" />
            <div className="feature-pill text-xs md:text-sm whitespace-nowrap shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              {c.label}
            </div>
          </div>
        ))}

        <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 pointer-events-auto">
          <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">Get a Free Quote</a>
        </div>
      </div>

      {/* Phase 4: Dark→light transition */}
      <div
        ref={fadeRef}
        className="absolute inset-0 z-[15] pointer-events-none opacity-0"
        style={{ background: "#faf7f1", willChange: "opacity" }}
      />

    </section>
  );
}
