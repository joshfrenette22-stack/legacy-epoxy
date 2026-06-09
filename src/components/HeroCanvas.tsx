"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TOTAL = 84;
const frameSrc = (i: number) => `/frames/frame_${String(i).padStart(3, "0")}.jpg`;
const PHONE = "9705551234"; // TODO: replace with real number

/**
 * Draw an image onto a canvas with "object-fit: cover" behavior.
 * Safari doesn't support object-fit on <canvas>, so we calculate it manually.
 */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(cw / iw, ch / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const sx = (cw - sw) / 2;
  const sy = (ch - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

export default function HeroCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const cur = useRef(0);
  const images = useRef<HTMLImageElement[]>([]);
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

  // Preload + decode all frames into Image objects (kept in memory)
  useEffect(() => {
    if (reduced) return;
    let count = 0;
    const imgs: HTMLImageElement[] = new Array(TOTAL);

    for (let i = 0; i < TOTAL; i++) {
      const img = new Image();
      img.src = frameSrc(i + 1);
      imgs[i] = img;
      const done = () => {
        count++;
        if (count >= TOTAL) {
          images.current = imgs;
          setReady(true);
        }
      };
      img.decode().then(done, done);
    }
  }, [reduced]);

  // Size canvas to container and draw a frame
  const paintFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const img = images.current[idx];
    if (!canvas || !img) return;

    const rect = canvas.getBoundingClientRect();
    const cw = rect.width;
    const ch = rect.height;

    // Size canvas buffer to 1x CSS pixels (not retina) for performance
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cw, ch);
    drawCover(ctx, img, cw, ch);
  }, []);

  // Paint first frame + handle resize once ready
  useEffect(() => {
    if (!ready) return;
    paintFrame(0);

    const onResize = () => paintFrame(cur.current);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [ready, paintFrame]);

  // GSAP scroll — dynamic import avoids SSR
  useEffect(() => {
    if (reduced || !ready) return;
    const el = pinRef.current;
    const h1 = h1Ref.current;
    const h2 = h2Ref.current;
    if (!el || !h1 || !h2) return;

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

        // Frame scrub — drawImage from pre-decoded Image objects (pure GPU blit)
        tl.to(o, {
          f: TOTAL - 1,
          ease: "none",
          onUpdate() {
            const idx = Math.round(o.f);
            if (idx !== cur.current) {
              cur.current = idx;
              paintFrame(idx);
            }
          },
        }, 0);

        // Headline 1: opacity + transform only (no layout triggers)
        tl.fromTo(h1,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0.02);
        tl.to(h1,
          { opacity: 0, y: -30, duration: 0.12, ease: "power2.in" }, 0.22);

        // Headline 2: opacity + transform only
        tl.fromTo(h2,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.5);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [reduced, ready, paintFrame]);

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
      {/* Canvas — drawImage from pre-decoded frames, no src swapping */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1]"
        style={{ display: "block" }}
      />

      {/* Immersive gradient overlays — GPU composited layers */}
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
      <div ref={h1Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0" style={{ willChange: "opacity, transform" }}>
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
      <div ref={h2Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0" style={{ willChange: "opacity, transform" }}>
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
