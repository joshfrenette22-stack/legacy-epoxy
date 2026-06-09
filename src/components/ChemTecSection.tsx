"use client";

import { useEffect, useRef, useState } from "react";

export default function ChemTecSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const mobileRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    mobileRef.current = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMounted(true);
  }, []);

  // Video readiness
  useEffect(() => {
    if (!mounted) return;

    if (mobileRef.current) {
      setReady(true);
      return;
    }

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
  }, [mounted]);

  // GSAP scroll-scrub with alternating left/right text
  useEffect(() => {
    if (!ready) return;
    const el = pinRef.current;
    const t1 = t1Ref.current;
    const t2 = t2Ref.current;
    const t3 = t3Ref.current;
    if (!el || !t1 || !t2 || !t3) return;

    const isMobile = mobileRef.current;
    const video = videoRef.current;
    const canSeek = !isMobile && video && video.readyState >= 2;
    const dur = canSeek ? (video!.duration || 6) : 6;

    let cleanup: (() => void) | undefined;

    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: isMobile ? "+=350%" : "+=500%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Video seek across full timeline
        if (canSeek) {
          const o = { t: 0 };
          tl.to(o, {
            t: dur,
            duration: 1,
            ease: "none",
            onUpdate() {
              if (Math.abs(video!.currentTime - o.t) > 0.03) {
                video!.currentTime = o.t;
              }
            },
          }, 0);
        }

        // ── Text 1: LEFT side — "The science behind the surface" ──
        tl.fromTo(t1,
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.03);
        tl.to(t1,
          { opacity: 0, x: -60, duration: 0.08, ease: "power2.in" }, 0.28);

        // ── Text 2: RIGHT side — "Engineered for extremes" ──
        tl.fromTo(t2,
          { opacity: 0, x: 80 },
          { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.36);
        tl.to(t2,
          { opacity: 0, x: 60, duration: 0.08, ease: "power2.in" }, 0.61);

        // ── Text 3: LEFT side — "Built to last a lifetime" ──
        tl.fromTo(t3,
          { opacity: 0, x: -80 },
          { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.68);
        tl.to(t3,
          { opacity: 0, x: -60, duration: 0.06, ease: "power2.in" }, 0.92);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [ready]);

  const isMobile = mobileRef.current;

  return (
    <section
      ref={pinRef}
      className="relative overflow-hidden"
      style={{ height: "100dvh", background: "#faf7f1" }}
    >
      {/* Video — bucket animation is the star, stays centered */}
      {mounted && isMobile ? (
        <div className="absolute inset-0 z-[1] bg-paper" />
      ) : (
        <video
          ref={videoRef}
          src="/chemtec.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        />
      )}

      {/* Immersive cream gradient edges */}
      <div className="chemtec-gradient absolute inset-x-0 top-0 h-48 z-[3]"
        style={{ background: "linear-gradient(to bottom, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-x-0 bottom-0 h-48 z-[3]"
        style={{ background: "linear-gradient(to top, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 left-0 w-[20%] z-[2]"
        style={{ background: "linear-gradient(to right, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 right-0 w-[20%] z-[2]"
        style={{ background: "linear-gradient(to left, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-0 z-[2]"
        style={{ background: "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 30%, rgba(250,247,241,0.55) 100%)" }} />

      {/* ── Text 1: LEFT side ── */}
      <div
        ref={t1Ref}
        className="absolute inset-y-0 z-10 flex flex-col justify-center pointer-events-none opacity-0 left-0 px-6 md:px-12 lg:px-20"
        style={{ willChange: "opacity, transform", width: isMobile ? "100%" : "45%" }}
      >
        <div className="pointer-events-auto">
          <p className="text-orange text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
            ChemTec Certified
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.08]">
            The science behind{" "}
            <span className="font-serif italic">the surface.</span>
          </h2>
          <p className="mt-5 text-sm md:text-base lg:text-lg text-ink/50 max-w-md leading-relaxed">
            We&apos;re Northern Colorado&apos;s only certified ChemTec installer.
            Industrial-grade resin systems most contractors can&apos;t even order.
          </p>
        </div>
      </div>

      {/* ── Text 2: RIGHT side ── */}
      <div
        ref={t2Ref}
        className="absolute inset-y-0 z-10 flex flex-col justify-center pointer-events-none opacity-0 right-0 px-6 md:px-12 lg:px-20 text-right"
        style={{ willChange: "opacity, transform", width: isMobile ? "100%" : "45%" }}
      >
        <div className="pointer-events-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.08]">
            Engineered for{" "}
            <span className="font-serif italic">extremes.</span>
          </h2>
          <p className="mt-5 text-sm md:text-base lg:text-lg text-ink/50 max-w-md ml-auto leading-relaxed">
            Hot tires. Road salt. Gasoline. Brake fluid.
            ChemTec&apos;s polyaspartic system doesn&apos;t just resist damage —
            it shrugs it off entirely.
          </p>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <span className="chemtec-chip">400°F Hot-Tire Rated</span>
            <span className="chemtec-chip">UV Stable</span>
            <span className="chemtec-chip">Chemical Impervious</span>
          </div>
        </div>
      </div>

      {/* ── Text 3: LEFT side ── */}
      <div
        ref={t3Ref}
        className="absolute inset-y-0 z-10 flex flex-col justify-center pointer-events-none opacity-0 left-0 px-6 md:px-12 lg:px-20"
        style={{ willChange: "opacity, transform", width: isMobile ? "100%" : "45%" }}
      >
        <div className="pointer-events-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-ink tracking-tight leading-[1.08]">
            Built to last{" "}
            <span className="font-serif italic">a lifetime.</span>
          </h2>
          <p className="mt-5 text-sm md:text-base lg:text-lg text-ink/50 max-w-md leading-relaxed">
            Every install comes with a 10-year warranty backed by ChemTec.
            This isn&apos;t a weekend paint job — it&apos;s a professional surface
            that outlasts the house.
          </p>
          <div className="mt-6">
            <a href="#quote" className="btn-pill btn-pill-primary text-sm md:text-base">
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
