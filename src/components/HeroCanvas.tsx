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
  const [reducedMotion, setReducedMotion] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[index];
    if (!img || !img.complete) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    currentFrameRef.current = index;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Preload all frames
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
          drawFrame(0);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Draw first frame immediately once it loads
    if (images[0]) {
      images[0].onload = () => {
        drawFrame(0);
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setLoaded(true);
        }
      };
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
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
        },
      });

      // Frame scrub
      tl.to(
        { frame: 0 },
        {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          snap: "frame",
          onUpdate: function () {
            const idx = Math.round(this.targets()[0].frame);
            if (idx !== currentFrameRef.current) {
              requestAnimationFrame(() => drawFrame(idx));
            }
          },
        },
        0
      );

      // Scale + perspective zoom
      tl.fromTo(
        wrap,
        { scale: 0.86, transformOrigin: "center center" },
        { scale: 1, ease: "none" },
        0
      );

      // Headline 1: visible at start, fades out by 40%
      tl.fromTo(h1, { opacity: 1 }, { opacity: 0, duration: 0.35 }, 0.15);

      // Headline 2: fades in at 50%, stays
      tl.fromTo(h2, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5);
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
        {/* Static poster */}
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
    <section ref={sectionRef} className="hero-bg relative min-h-screen">
      {/* Glow behind canvas */}
      <div className="hero-glow" />

      {/* Canvas container */}
      <div
        ref={wrapRef}
        className="hero-canvas-wrap hero-canvas-mask relative mx-auto"
        style={{ willChange: "transform" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-auto block"
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
