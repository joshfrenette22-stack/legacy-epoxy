"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = "9705551234"; // TODO: replace with real number

const CALLOUTS = [
  { label: "Diamond Blade Prepped", x: 18, y: 72, mobileX: 12, mobileY: 68 },
  { label: "Hot-Tire Proof", x: 75, y: 68, mobileX: 78, mobileY: 65 },
  { label: "Chemical Resistant", x: 28, y: 45, mobileX: 15, mobileY: 42 },
  { label: "Mirror-Gloss Finish", x: 62, y: 82, mobileX: 55, mobileY: 80 },
  { label: "UV Stable", x: 82, y: 40, mobileX: 82, mobileY: 38 },
  { label: "10-Year Warranty", x: 50, y: 30, mobileX: 50, mobileY: 28 },
  { label: "Slip-Resistant", x: 38, y: 60, mobileX: 35, mobileY: 55 },
  { label: "Single-Day Install", x: 68, y: 52, mobileX: 65, mobileY: 48 },
];

export default function HeroCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const h3Ref = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const calloutRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Detect environment
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);

    const isMobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMobile(isMobile);
    setMounted(true);

    // Mobile: ready immediately, no video needed
    if (isMobile) {
      setReady(true);
    }

    return () => mq.removeEventListener("change", fn);
  }, []);

  // Desktop: wait for video
  useEffect(() => {
    if (!mounted || mobile || reduced) return;

    const video = videoRef.current;
    if (!video) { setReady(true); return; }

    let resolved = false;
    const markReady = () => {
      if (resolved) return;
      resolved = true;
      if (video.readyState >= 2) video.currentTime = 0;
      setReady(true);
    };

    if (video.readyState >= 2) { markReady(); return; }

    video.addEventListener("loadeddata", markReady);
    video.load();
    const timeout = setTimeout(markReady, 3000);

    return () => {
      video.removeEventListener("loadeddata", markReady);
      clearTimeout(timeout);
    };
  }, [mounted, mobile, reduced]);

  // Desktop: all GSAP in one context to prevent conflicts
  useEffect(() => {
    if (reduced || !ready || mobile) return;
    const el = pinRef.current;
    const h1 = h1Ref.current;
    const h2 = h2Ref.current;
    const h3 = h3Ref.current;
    const fade = fadeRef.current;
    const callouts = calloutRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!el || !h1 || !h2 || !h3 || !fade || callouts.length === 0) return;

    const video = videoRef.current;
    const canSeek = video && video.readyState >= 2;
    const dur = canSeek ? (video!.duration || 3.5) : 3.5;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        // ── Entrance animation: h1 fades in on load (no scroll) ──
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

        // Video scrub across all content phases
        if (canSeek) {
          const o = { t: 0 };
          tl.to(o, {
            t: dur,
            duration: 0.55,
            ease: "none",
            onUpdate() {
              if (Math.abs(video!.currentTime - o.t) > 0.03) {
                video!.currentTime = o.t;
              }
            },
          }, 0);
        }

        // ── PHASE 1: Headline 1 fades out ──
        // immediateRender:false prevents the scroll timeline from overriding the entrance anim
        tl.fromTo(h1,
          { opacity: 1, y: 0 },
          { opacity: 0, y: -30, duration: 0.08, ease: "power2.in", immediateRender: false },
          0.10
        );

        // ── PHASE 2: Headline 2 in then out ──
        tl.fromTo(h2, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.24);
        tl.to(h2, { opacity: 0, y: -30, duration: 0.06, ease: "power2.in" }, 0.42);

        // ── PHASE 3: Feature callouts stagger in ──
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
  }, [reduced, ready, mobile]);

  // ── Mobile layout: simple, no GSAP pinning ──
  if (mounted && mobile) {
    return (
      <>
        {/* Hero with text */}
        <section className="relative flex items-center justify-center overflow-hidden"
          style={{ background: "#0d1117", minHeight: "100dvh" }}>
          <img
            src="/images/hero-poster.jpg"
            alt="Epoxy floor installation"
            className="absolute inset-0 w-full h-full object-cover z-[1] opacity-70"
          />
          <div className="hero-gradient absolute inset-x-0 top-0 h-32 z-[3]"
            style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.85), transparent)" }} />
          <div className="hero-gradient absolute inset-x-0 bottom-0 h-40 z-[3]"
            style={{ background: "linear-gradient(to top, #0d1117, transparent)" }} />

          <div className="relative z-10 text-center px-5 max-w-3xl mx-auto py-24">
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

        {/* Feature callouts band */}
        <section className="py-12 px-5 overflow-hidden" style={{ background: "#0d1117" }}>
          <p className="text-orange text-xs font-semibold tracking-[0.2em] uppercase text-center mb-6">
            What Sets Us Apart
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
            {CALLOUTS.map((c) => (
              <span key={c.label} className="feature-pill text-xs" data-reveal>{c.label}</span>
            ))}
          </div>
        </section>
      </>
    );
  }

  // Reduced motion fallback
  if (reduced) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 120% 100% at 50% 40%, #151c26 0%, #0d1117 70%)" }}>
        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
          <div className="warranty-chip mx-auto mb-6">
            <span className="w-2 h-2 rounded-full bg-orange inline-block" />
            1 of 1 — Only certified ChemTec installer · 10-year warranty
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-cream tracking-tight leading-[1.1]">
            A garage floor <span className="font-serif italic">built to outlast</span> the house.
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {CALLOUTS.map((c) => (
              <span key={c.label} className="feature-pill">{c.label}</span>
            ))}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#quote" className="btn-pill btn-pill-primary text-lg">Get a Free Quote</a>
            <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost">Call Now</a>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <img src="/images/hero-poster.jpg" alt="" className="w-full h-full object-cover opacity-40" />
        </div>
      </section>
    );
  }

  // ── Desktop: full scroll-scrub experience ──
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

      {/* Headline 1 */}
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

      {/* Loading overlay */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-30 bg-[#0d1117]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
            <span className="text-sm text-cream/40 font-medium">Loading…</span>
          </div>
        </div>
      )}
    </section>
  );
}
