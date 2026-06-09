"use client";

import { useEffect, useRef, useState } from "react";

export default function ChemTecSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMobile(isMobile);
  }, []);

  // Wait for video — mobile fallback
  useEffect(() => {
    if (mobile) {
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
  }, [mobile]);

  // GSAP scroll-scrub with 3 text phases
  useEffect(() => {
    if (!ready) return;
    const el = pinRef.current;
    const t1 = t1Ref.current;
    const t2 = t2Ref.current;
    const t3 = t3Ref.current;
    if (!el || !t1 || !t2 || !t3) return;

    const video = videoRef.current;
    const canSeek = !mobile && video && video.readyState >= 2;
    const dur = canSeek ? (video!.duration || 10) : 10;

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
            end: mobile ? "+=350%" : "+=500%",
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

        // ── Text 1: "The Science Behind the Surface" (0.0 → 0.3) ──
        tl.fromTo(t1,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power3.out" }, 0.02);
        tl.to(t1,
          { opacity: 0, y: -40, duration: 0.08, ease: "power2.in" }, 0.25);

        // ── Text 2: "Engineered for Extremes" (0.3 → 0.65) ──
        tl.fromTo(t2,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power3.out" }, 0.33);
        tl.to(t2,
          { opacity: 0, y: -40, duration: 0.08, ease: "power2.in" }, 0.58);

        // ── Text 3: "Built to Last a Lifetime" (0.65 → 1.0) ──
        tl.fromTo(t3,
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power3.out" }, 0.66);
        tl.to(t3,
          { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.92);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [ready, mobile]);

  return (
    <section
      ref={pinRef}
      className="relative overflow-hidden"
      style={{ height: "100dvh", background: "#faf7f1" }}
    >
      {/* Video / Mobile poster */}
      {mobile ? (
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

      {/* Immersive white/cream gradient edges — blends video into page */}
      <div className="chemtec-gradient absolute inset-x-0 top-0 h-48 z-[3]"
        style={{ background: "linear-gradient(to bottom, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-x-0 bottom-0 h-48 z-[3]"
        style={{ background: "linear-gradient(to top, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 left-0 w-[20%] z-[2]"
        style={{ background: "linear-gradient(to right, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 right-0 w-[20%] z-[2]"
        style={{ background: "linear-gradient(to left, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-0 z-[2]"
        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, rgba(250,247,241,0.5) 100%)" }} />

      {/* ── Text Phase 1 ── */}
      <div
        ref={t1Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0"
        style={{ willChange: "opacity, transform" }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-orange text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-5">
            ChemTec Certified
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-ink tracking-tight leading-[1.08] drop-shadow-[0_1px_20px_rgba(250,247,241,0.4)]">
            The science behind{" "}
            <span className="font-serif italic">the surface.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink/50 max-w-xl mx-auto leading-relaxed">
            We&apos;re Northern Colorado&apos;s only certified ChemTec installer.
            That means access to industrial-grade resin systems most contractors can&apos;t even order.
          </p>
        </div>
      </div>

      {/* ── Text Phase 2 ── */}
      <div
        ref={t2Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0"
        style={{ willChange: "opacity, transform" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-ink tracking-tight leading-[1.08] drop-shadow-[0_1px_20px_rgba(250,247,241,0.4)]">
            Engineered for{" "}
            <span className="font-serif italic">extremes.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink/50 max-w-xl mx-auto leading-relaxed">
            Hot tires. Road salt. Gasoline. Brake fluid.
            ChemTec&apos;s multi-layer polyaspartic system doesn&apos;t just resist damage —
            it was formulated to shrug it off entirely.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="chemtec-chip">400°F Hot-Tire Rated</span>
            <span className="chemtec-chip">UV Stable — No Yellowing</span>
            <span className="chemtec-chip">Chemical Impervious</span>
          </div>
        </div>
      </div>

      {/* ── Text Phase 3 ── */}
      <div
        ref={t3Ref}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-5 pointer-events-none opacity-0"
        style={{ willChange: "opacity, transform" }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-ink tracking-tight leading-[1.08] drop-shadow-[0_1px_20px_rgba(250,247,241,0.4)]">
            Built to last{" "}
            <span className="font-serif italic">a lifetime.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg text-ink/50 max-w-xl mx-auto leading-relaxed">
            Every install comes with a 10-year warranty backed by ChemTec.
            This isn&apos;t a weekend paint job — it&apos;s a professional surface
            that outlasts the house it&apos;s built into.
          </p>
          <div className="mt-8 pointer-events-auto">
            <a href="#quote" className="btn-pill btn-pill-primary text-base md:text-lg">
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
