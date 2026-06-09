"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 106;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i).padStart(3, "0")}.jpg`;

const PHONE = "9705551234"; // TODO: replace with real number

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const canvasSizedRef = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvasSizedRef.current = true;
    // Redraw current frame at new size
    if (imagesRef.current.length > 0) {
      drawFrameInternal(currentFrameRef.current);
    }
  }, []);

  const drawFrameInternal = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // "cover" — fill canvas, crop overflow
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
    currentFrameRef.current = index;
  }, []);

  const drawFrame = drawFrameInternal;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Size canvas to viewport
  useEffect(() => {
    if (reducedMotion) return;
    sizeCanvas();
    const onResize = () => sizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reducedMotion, sizeCanvas]);

  useEffect(() => {
    if (reducedMotion) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      images.push(img);
    }
    imagesRef.current = images;

    // Draw first frame as soon as it loads
    images[0].onload = () => {
      drawFrame(0);
      loadedCount++;
      if (loadedCount === TOTAL_FRAMES) setLoaded(true);
    };

    // Track all other frames loading
    for (let i = 1; i < images.length; i++) {
      const onDone = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };
      images[i].onload = onDone;
      images[i].onerror = onDone;
    }
  }, [reducedMotion, drawFrame]);

  useEffect(() => {
    if (reducedMotion || !loaded) return;

    const section = sectionRef.current;
    const wrap = wrapRef.current;
    const h1 = headline1Ref.current;
    const h2 = headline2Ref.current;
    if (!section || !wrap || !h1 || !h2) return;

    const ctx = gsap.context(() => {
      const obj = { frame: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 1.5, // higher = smoother interpolation
          anticipatePin: 1,
        },
      });

      // Frame scrub — no snap for smooth playback
      tl.to(
        obj,
        {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          onUpdate: () => {
            const idx = Math.round(obj.frame);
            if (idx !== currentFrameRef.current) {
              drawFrame(idx);
            }
          },
        },
        0
      );

      // Scale zoom: starts slightly pulled back, fills screen
      tl.fromTo(
        wrap,
        { scale: 0.88, transformOrigin: "center center" },
        { scale: 1, ease: "none" },
        0
      );

      // Headline 1: visible at start, fades out by ~40%
      tl.fromTo(h1, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0.1);

      // Headline 2: fades in at 50%
      tl.fromTo(h2, { opacity: 0 }, { opacity: 1, duration: 0.25 }, 0.5);
    });

    return () => ctx.revert();
  }, [reducedMotion, loaded, drawFrame]);

  // Reduced motion fallback
  if (reducedMotion) {
    return (
      <section className="hero-bg relative min-h-[90vh] flex items-center justify-center pt-20">
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
            <a href="#quote" className="btn-pill btn-pill-primary text-lg">
              Get a Free Quote
            </a>
            <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost">
              Call Now
            </a>
          </div>
        </div>
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-poster.jpg"
            alt="Luxury home with epoxy garage floor"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="hero-bg relative h-screen overflow-hidden">
      {/* Glow behind canvas */}
      <div className="hero-glow" />

      {/* Full-screen canvas container */}
      <div
        ref={wrapRef}
        className="absolute inset-0 hero-canvas-mask"
        style={{ willChange: "transform" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover block"
          style={{ objectFit: "cover" }}
          aria-hidden="true"
        />
        <div className="hero-vignette" />

        {/* Headline 1 */}
        <div ref={headline1Ref} className="hero-overlay">
          <div className="warranty-chip mb-6">
            <span className="w-2 h-2 rounded-full bg-orange inline-block" />
            1 of 1 — Only certified ChemTec installer · 10-year warranty
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl">
            A garage floor{" "}
            <span className="font-serif italic">built to outlast</span> the
            house.
          </h1>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">
              Get a Free Quote
            </a>
            <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost text-base">
              Call Now
            </a>
          </div>
        </div>

        {/* Headline 2 */}
        <div ref={headline2Ref} className="hero-overlay" style={{ opacity: 0 }}>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-cream tracking-tight leading-[1.08] max-w-4xl">
            Not a coating.{" "}
            <span className="font-serif italic">A finished surface.</span>
          </h2>
          <div className="mt-8">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-10 h-10 border-2 border-orange/30 border-t-orange rounded-full animate-spin" />
        </div>
      )}
    </section>
  );
}
