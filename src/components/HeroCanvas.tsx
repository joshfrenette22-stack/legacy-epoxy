"use client";

import { useEffect, useRef, useState } from "react";

const TOTAL = 84;
const frameSrc = (i: number) => `/frames/frame_${String(i).padStart(3, "0")}.jpg`;
const PHONE = "9705551234"; // TODO: replace with real number

export default function HeroCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const cur = useRef(0);
  const srcs = useRef<string[]>([]);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Detect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // Preload + decode all frames
  useEffect(() => {
    if (reduced) return;
    let count = 0;
    const paths: string[] = [];

    for (let i = 1; i <= TOTAL; i++) {
      const path = frameSrc(i);
      paths.push(path);
      const img = new Image();
      img.src = path;
      const done = () => {
        count++;
        if (count >= TOTAL) {
          srcs.current = paths;
          setReady(true);
        }
      };
      img.decode().then(done, done);
    }
  }, [reduced]);

  // Set initial frame once ready
  useEffect(() => {
    if (!ready || !imgRef.current) return;
    imgRef.current.src = srcs.current[0];
  }, [ready]);

  // GSAP scroll — dynamic import avoids SSR
  useEffect(() => {
    if (reduced || !ready) return;
    const el = pinRef.current;
    const h1 = h1Ref.current;
    const h2 = h2Ref.current;
    const img = imgRef.current;
    if (!el || !h1 || !h2 || !img) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const o = { f: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Frame scrub — just swap img src, browser serves from decode cache
        tl.to(o, {
          f: TOTAL - 1,
          ease: "none",
          onUpdate() {
            const idx = Math.round(o.f);
            if (idx !== cur.current) {
              img.src = srcs.current[idx];
              cur.current = idx;
            }
          },
        }, 0);

        // Headline 1: fade + slide in, then out
        tl.fromTo(h1,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.02);
        tl.to(h1,
          { autoAlpha: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.22);

        // Headline 2: fade + slide in
        tl.fromTo(h2,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.5);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [reduced, ready]);

  // ── Reduced motion fallback ──
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

  return (
    <section
      ref={pinRef}
      className="relative h-screen overflow-hidden"
      style={{ background: "#0d1117" }}
    >
      {/* Hero image — src swapped on scroll, object-fit:cover handles sizing */}
      <img
        ref={imgRef}
        src="/images/hero-poster.jpg"
        alt="Epoxy floor installation"
        className="absolute inset-0 w-full h-full object-cover z-[1]"
        draggable={false}
      />

      {/* Immersive gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-44 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.85), transparent)" }} />
      <div className="absolute inset-x-0 bottom-0 h-56 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to top, #0d1117, transparent)" }} />
      <div className="absolute inset-y-0 left-0 w-[18%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(13,17,23,0.65), transparent)" }} />
      <div className="absolute inset-y-0 right-0 w-[18%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to left, rgba(13,17,23,0.65), transparent)" }} />
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 50%, rgba(13,17,23,0.55) 100%)" }} />

      {/* Headline 1 */}
      <div ref={h1Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none invisible">
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
      <div ref={h2Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none invisible">
        <div className="pointer-events-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
            Not a coating. <span className="font-serif italic">A finished surface.</span>
          </h2>
          <div className="mt-8">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">Get a Free Quote</a>
          </div>
        </div>
      </div>

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
