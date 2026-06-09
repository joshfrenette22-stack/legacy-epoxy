"use client";

import { useEffect, useRef, useState } from "react";

const PHONE = "9705551234"; // TODO: replace with real number

export default function HeroCanvas() {
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const h1Ref = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // Detect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  // Wait for video to be seekable
  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      if (video.readyState >= 2) {
        video.currentTime = 0;
        setVideoReady(true);
      }
    };

    if (video.readyState >= 2) {
      video.currentTime = 0;
      setVideoReady(true);
    } else {
      video.addEventListener("loadeddata", onReady);
      return () => video.removeEventListener("loadeddata", onReady);
    }
  }, [reduced]);

  // Animate headline 1 in on page load (no scroll required)
  useEffect(() => {
    if (reduced || !videoReady) return;
    const h1 = h1Ref.current;
    if (!h1) return;

    let cleanup: (() => void) | undefined;
    const timer = setTimeout(async () => {
      const gsap = (await import("gsap")).default;
      gsap.fromTo(h1,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      );
    }, 300);

    return () => {
      clearTimeout(timer);
      cleanup?.();
    };
  }, [reduced, videoReady]);

  // GSAP scroll-scrub: seek video + animate headlines
  useEffect(() => {
    if (reduced || !videoReady) return;
    const el = pinRef.current;
    const video = videoRef.current;
    const h1 = h1Ref.current;
    const h2 = h2Ref.current;
    if (!el || !video || !h1 || !h2) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const duration = video.duration || 3.5;

      const ctx = gsap.context(() => {
        const o = { t: 0 };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=250%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Video seek — scrub currentTime from 0 to duration
        tl.to(o, {
          t: duration,
          ease: "none",
          onUpdate() {
            // Only seek if video is ready and time actually changed
            const target = o.t;
            if (Math.abs(video.currentTime - target) > 0.03) {
              video.currentTime = target;
            }
          },
        }, 0);

        // Headline 1: already visible from load animation, fade out on scroll
        tl.to(h1,
          { opacity: 0, y: -30, duration: 0.15, ease: "power2.in" }, 0.15);

        // Headline 2: fade in
        tl.fromTo(h2,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, 0.5);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [reduced, videoReady]);

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
      {/* Video — single MP4 with all-keyframe encoding for instant seeking */}
      <video
        ref={videoRef}
        src="/hero.mp4"
        muted
        playsInline
        preload="auto"
        poster="/images/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover z-[1]"
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

      {/* Headline 1 — animates in on page load, fades out on scroll */}
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

      {/* Headline 2 — fades in mid-scroll */}
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

      {/* Loading overlay — shows until video is seekable */}
      {!videoReady && (
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
