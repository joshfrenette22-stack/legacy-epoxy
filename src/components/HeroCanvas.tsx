"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL = 169;
const src = (i: number) => `/frames/frame_${String(i).padStart(3, "0")}.jpg`;
const PHONE = "9705551234"; // TODO: replace with real number

export default function HeroCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const imgs = useRef<HTMLImageElement[]>([]);
  const frame = useRef(0);
  const rafId = useRef(0);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Preload every frame, decode in parallel
  useEffect(() => {
    if (reduced) return;
    let n = 0;
    const arr: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL; i++) {
      const img = new Image();
      img.src = src(i);
      arr.push(img);

      const tick = () => {
        n++;
        // Show canvas as soon as frame 1 is ready
        if (i === 1) draw(0);
        if (n >= TOTAL) setReady(true);
      };
      // decode() is faster than onload for preloading
      img.decode().then(tick, tick);
    }
    imgs.current = arr;
  }, [reduced]);

  // Draw: blit at native resolution — no scaling, no clearing needed
  function draw(index: number) {
    if (!ctxRef.current) {
      const c = canvasRef.current;
      if (!c) return;
      const ctx = c.getContext("2d", { alpha: false });
      if (!ctx) return;
      ctxRef.current = ctx;
    }
    const img = imgs.current[index];
    if (!img?.naturalWidth) return;

    const c = canvasRef.current!;
    // Set canvas intrinsic size to match image (once)
    if (c.width !== img.naturalWidth) {
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
    }
    ctxRef.current!.drawImage(img, 0, 0);
    frame.current = index;
  }

  // Schedule a draw on next animation frame (debounced)
  function requestDraw(index: number) {
    if (index === frame.current) return;
    cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => draw(index));
  }

  // GSAP scroll timeline
  useEffect(() => {
    if (reduced || !ready) return;
    const pin = pinRef.current;
    const h1 = h1Ref.current;
    const h2 = h2Ref.current;
    if (!pin || !h1 || !h2) return;

    const ctx = gsap.context(() => {
      const o = { f: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      // Scrub frames
      tl.to(o, {
        f: TOTAL - 1,
        ease: "none",
        onUpdate() {
          requestDraw(Math.round(o.f));
        },
      }, 0);

      // Headline 1: slide up + fade in, then slide up + fade out
      tl.fromTo(h1, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.02);
      tl.to(h1, { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.22);

      // Headline 2: slide up + fade in
      tl.fromTo(h2, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.5);
    });

    return () => ctx.revert();
  }, [reduced, ready]);

  // ── Reduced-motion fallback ──
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
      {/* Canvas — native res, CSS stretches to fill viewport */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover" }}
        aria-hidden="true"
      />

      {/* ── Immersive gradient overlays ── */}
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-44 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, rgba(13,17,23,0.85) 0%, rgba(13,17,23,0) 100%)" }} />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-56 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to top, #0d1117 0%, rgba(13,17,23,0) 100%)" }} />
      {/* Left vignette */}
      <div className="absolute inset-y-0 left-0 w-[20%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(13,17,23,0.7) 0%, transparent 100%)" }} />
      {/* Right vignette */}
      <div className="absolute inset-y-0 right-0 w-[20%] z-[2] pointer-events-none"
        style={{ background: "linear-gradient(to left, rgba(13,17,23,0.7) 0%, transparent 100%)" }} />
      {/* Radial vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, transparent 50%, rgba(13,17,23,0.6) 100%)" }} />

      {/* ── Headline 1 ── */}
      <div ref={h1Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none" style={{ opacity: 0 }}>
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

      {/* ── Headline 2 ── */}
      <div ref={h2Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none" style={{ opacity: 0 }}>
        <div className="pointer-events-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl mx-auto drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
            Not a coating. <span className="font-serif italic">A finished surface.</span>
          </h2>
          <div className="mt-8">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">Get a Free Quote</a>
          </div>
        </div>
      </div>

      {/* Loading */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#0d1117]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
            <span className="text-sm text-cream/40">Loading experience…</span>
          </div>
        </div>
      )}
    </section>
  );
}
