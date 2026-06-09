"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 169;
const frameSrc = (i: number) =>
  `/frames/frame_${String(i).padStart(3, "0")}.jpg`;

const PHONE = "9705551234"; // TODO: replace with real number

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);

  // Check reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Preload frames
  useEffect(() => {
    if (reducedMotion) return;

    const imgs: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.decode?.().catch(() => {});
      const done = () => {
        count++;
        // Draw first frame as soon as possible
        if (i === 1 && canvasRef.current) {
          sizeAndDraw(0);
        }
        if (count >= TOTAL_FRAMES) setLoaded(true);
      };
      img.onload = done;
      img.onerror = done;
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [reducedMotion]);

  function sizeAndDraw(index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img?.complete) return;

    // Size canvas to viewport at device pixel ratio for sharpness
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cw = vw * dpr;
    const ch = vh * dpr;

    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = vw + "px";
      canvas.style.height = vh + "px";
    }

    // Draw with "cover" fit — fill canvas, center-crop overflow
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const dx = (cw - sw) / 2;
    const dy = (ch - sh) / 2;

    ctx.drawImage(img, dx, dy, sw, sh);
    frameRef.current = index;
  }

  // Resize handler
  useEffect(() => {
    if (reducedMotion) return;
    const onResize = () => {
      if (imagesRef.current.length) sizeAndDraw(frameRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reducedMotion]);

  // GSAP scroll animation
  useEffect(() => {
    if (reducedMotion || !loaded) return;
    const section = sectionRef.current;
    const h1 = headline1Ref.current;
    const h2 = headline2Ref.current;
    if (!section || !h1 || !h2) return;

    const ctx = gsap.context(() => {
      const obj = { f: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      // Frame scrub
      tl.to(obj, {
        f: TOTAL_FRAMES - 1,
        ease: "none",
        onUpdate() {
          const idx = Math.round(obj.f);
          if (idx !== frameRef.current) sizeAndDraw(idx);
        },
      }, 0);

      // Headline 1: fade + slide up, then out
      tl.fromTo(h1,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" },
        0
      );
      tl.to(h1,
        { opacity: 0, y: -40, duration: 0.15, ease: "power2.in" },
        0.25
      );

      // Headline 2: fade + slide up in
      tl.fromTo(h2,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0.5
      );
    });

    return () => ctx.revert();
  }, [reducedMotion, loaded]);

  if (reducedMotion) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden"
        style={{ background: "radial-gradient(ellipse 120% 100% at 50% 40%, #151c26 0%, #0d1117 70%)" }}>
        <div className="relative z-10 text-center px-5 max-w-3xl mx-auto">
          <div className="warranty-chip mx-auto mb-6">
            <span className="w-2 h-2 rounded-full bg-orange inline-block" />
            1 of 1 — Only certified ChemTec installer · 10-year warranty
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-cream tracking-tight leading-[1.1]">
            A garage floor{" "}
            <span className="font-serif italic">built to outlast</span> the house.
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
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{ background: "radial-gradient(ellipse 130% 100% at 50% 30%, #1a2436 0%, #0d1117 60%)" }}
    >
      {/* Immersive gradient overlay — top */}
      <div className="absolute inset-x-0 top-0 h-40 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #0d1117 0%, transparent 100%)" }} />

      {/* Immersive gradient overlay — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-48 z-[3] pointer-events-none"
        style={{ background: "linear-gradient(to top, #0d1117 0%, transparent 100%)" }} />

      {/* Side vignettes */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: `
            linear-gradient(to right, #0d1117 0%, transparent 15%),
            linear-gradient(to left, #0d1117 0%, transparent 15%)
          `
        }} />

      {/* Ambient glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,99,26,0.04) 0%, transparent 70%)" }} />

      {/* Canvas — full screen, CSS object-fit cover */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1]"
        aria-hidden="true"
      />

      {/* Headline 1 */}
      <div ref={headline1Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none" style={{ opacity: 0 }}>
        <div className="pointer-events-auto">
          <div className="warranty-chip mb-6">
            <span className="w-2 h-2 rounded-full bg-orange inline-block" />
            1 of 1 — Only certified ChemTec installer · 10-year warranty
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl mx-auto">
            A garage floor{" "}
            <span className="font-serif italic">built to outlast</span> the house.
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">Get a Free Quote</a>
            <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost text-base">Call Now</a>
          </div>
        </div>
      </div>

      {/* Headline 2 */}
      <div ref={headline2Ref} className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none" style={{ opacity: 0 }}>
        <div className="pointer-events-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Not a coating.{" "}
            <span className="font-serif italic">A finished surface.</span>
          </h2>
          <div className="mt-8">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">Get a Free Quote</a>
          </div>
        </div>
      </div>

      {/* Loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-ink/60">
          <div className="w-10 h-10 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
        </div>
      )}
    </section>
  );
}
