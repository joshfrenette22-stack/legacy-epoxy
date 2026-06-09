"use client";

import { useEffect, useRef, useState } from "react";

const STARS = "★★★★★";

const REVIEWS = [
  { name: "Mike R.", text: "Best floor I've ever seen in a garage. Period." },
  { name: "Sarah T.", text: "They finished in one day. Looks like a showroom." },
  { name: "Dan K.", text: "Two years in, still looks brand new. Worth every penny." },
];

export default function ChemTecSection() {
  const pinRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const t1Ref = useRef<HTMLDivElement>(null);
  const t2Ref = useRef<HTMLDivElement>(null);
  const t3Ref = useRef<HTMLDivElement>(null);
  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    mobileRef.current = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMounted(true);
  }, []);

  // Mobile: manually start video autoplay
  useEffect(() => {
    if (!mounted || !mobileRef.current) return;
    const video = videoRef.current;
    if (!video) return;
    video.loop = true;
    video.play().catch(() => {});
  }, [mounted]);

  // GSAP scroll-scrub — runs on BOTH mobile and desktop
  useEffect(() => {
    if (!mounted) return;
    const isMobile = mobileRef.current;

    const raf = requestAnimationFrame(() => {
      const el = pinRef.current;
      const t1 = t1Ref.current;
      const t2 = t2Ref.current;
      const t3 = t3Ref.current;
      const reviews = reviewRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!el || !t1 || !t2 || !t3) return;

      const video = videoRef.current;

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
              scrub: isMobile ? 0.3 : 0.5,
              anticipatePin: 1,
            },
          });

          // Video scrub — desktop only
          if (video && !isMobile) {
            const dur = (video.duration && video.duration > 0) ? video.duration : 6;
            const o = { t: 0 };
            tl.to(o, {
              t: dur,
              duration: 1,
              ease: "none",
              onUpdate() {
                if (video.readyState >= 2 && Math.abs(video.currentTime - o.t) > 0.03) {
                  video.currentTime = o.t;
                }
              },
            }, 0);
          }

          if (isMobile) {
            // Mobile: centered text, slide up/down
            tl.fromTo(t1, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.1, ease: "power3.out" }, 0.03);
            tl.to(t1, { opacity: 0, y: -40, duration: 0.08, ease: "power2.in" }, 0.28);

            tl.fromTo(t2, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.1, ease: "power3.out" }, 0.36);
            reviews.forEach((review, i) => {
              tl.fromTo(review,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power2.out" },
                0.42 + i * 0.03
              );
            });
            tl.to(t2, { opacity: 0, y: -40, duration: 0.08, ease: "power2.in" }, 0.61);
            reviews.forEach((review) => {
              tl.to(review, { opacity: 0, duration: 0.06, ease: "power2.in" }, 0.61);
            });

            tl.fromTo(t3, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.1, ease: "power3.out" }, 0.68);
            tl.to(t3, { opacity: 0, y: -40, duration: 0.06, ease: "power2.in" }, 0.92);
          } else {
            // Desktop: left/right slide
            tl.fromTo(t1, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.03);
            tl.to(t1, { opacity: 0, x: -60, duration: 0.08, ease: "power2.in" }, 0.28);

            tl.fromTo(t2, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.36);
            reviews.forEach((review, i) => {
              tl.fromTo(review,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power2.out" },
                0.42 + i * 0.03
              );
            });
            tl.to(t2, { opacity: 0, x: 60, duration: 0.08, ease: "power2.in" }, 0.61);
            reviews.forEach((review) => {
              tl.to(review, { opacity: 0, duration: 0.06, ease: "power2.in" }, 0.61);
            });

            tl.fromTo(t3, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.68);
            tl.to(t3, { opacity: 0, x: -60, duration: 0.06, ease: "power2.in" }, 0.92);
          }
        });

        cleanupRef.current = () => ctx.revert();
      })();
    });

    const cleanupRef = { current: undefined as (() => void) | undefined };
    return () => {
      cancelAnimationFrame(raf);
      cleanupRef.current?.();
    };
  }, [mounted]);

  // ── Single render for both mobile and desktop ──
  return (
    <section
      ref={pinRef}
      className="relative overflow-hidden"
      style={{ height: "100dvh", background: "#faf7f1" }}
    >
      <video
        ref={videoRef}
        src="/chemtec.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-[1]"
      />

      {/* Cream gradient edges */}
      <div className="chemtec-gradient absolute inset-x-0 top-0 h-32 md:h-48 z-[3]"
        style={{ background: "linear-gradient(to bottom, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-x-0 bottom-0 h-32 md:h-48 z-[3]"
        style={{ background: "linear-gradient(to top, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 left-0 w-[22%] z-[2] hidden md:block"
        style={{ background: "linear-gradient(to right, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 right-0 w-[22%] z-[2] hidden md:block"
        style={{ background: "linear-gradient(to left, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-0 z-[2] hidden md:block"
        style={{ background: "radial-gradient(ellipse 55% 50% at 50% 50%, transparent 25%, rgba(250,247,241,0.6) 100%)" }} />

      {/* Text 1 — desktop: left-aligned card | mobile: centered card */}
      <div
        ref={t1Ref}
        className="absolute z-[5] pointer-events-none opacity-0 inset-x-0 md:inset-x-auto md:left-0 px-5 md:px-12 lg:px-16 flex items-start md:items-start justify-center md:justify-start w-full md:w-[44%]"
        style={{ willChange: "opacity, transform", top: "12%" }}
      >
        <div className="chemtec-card pointer-events-auto max-w-sm md:max-w-none text-center md:text-left">
          <p className="text-orange text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
            ChemTec Certified
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
            The science behind{" "}
            <span className="font-serif italic text-orange">the surface.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 max-w-md leading-relaxed">
            We&apos;re Northern Colorado&apos;s only certified ChemTec installer.
            Industrial-grade resin systems most contractors can&apos;t even order.
          </p>
        </div>
      </div>

      {/* Text 2 — desktop: right-aligned card | mobile: centered card */}
      <div
        ref={t2Ref}
        className="absolute z-[5] pointer-events-none opacity-0 inset-x-0 md:inset-x-auto md:right-0 px-5 md:px-12 lg:px-16 flex items-end md:items-end justify-center md:justify-end w-full md:w-[44%]"
        style={{ willChange: "opacity, transform", bottom: "10%" }}
      >
        <div className="chemtec-card pointer-events-auto max-w-sm md:max-w-none text-center md:text-right">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
            Engineered for{" "}
            <span className="font-serif italic text-orange">extremes.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 max-w-md md:ml-auto leading-relaxed">
            Hot tires. Road salt. Gasoline. Brake fluid.
            ChemTec&apos;s polyaspartic system shrugs it all off.
          </p>
          <div className="mt-4 flex flex-wrap justify-center md:justify-end gap-2">
            <span className="chemtec-chip">400°F Hot-Tire Rated</span>
            <span className="chemtec-chip">UV Stable</span>
            <span className="chemtec-chip">Chemical Impervious</span>
          </div>
        </div>
      </div>

      {/* Reviews — desktop: lower-left (rendered first so mobile refs overwrite) */}
      <div
        className="absolute z-[5] pointer-events-none left-0 px-5 md:px-12 lg:px-16 hidden md:block"
        style={{ width: "32%", bottom: "8%" }}
      >
        <div className="flex flex-col gap-3">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              ref={(el) => { reviewRefs.current[i] = el; }}
              className="chemtec-review opacity-0 text-left"
              style={{ willChange: "opacity, transform" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange text-sm tracking-wider">{STARS}</span>
                <span className="text-ink/40 text-xs font-semibold">{r.name}</span>
              </div>
              <p className="text-ink/70 text-xs md:text-sm leading-snug italic">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile reviews — centered (rendered second — refs overwrite desktop on mobile) */}
      <div
        className="absolute z-[5] pointer-events-none inset-x-0 px-5 md:hidden"
        style={{ top: "55%" }}
      >
        <div className="flex flex-col gap-2 max-w-sm mx-auto">
          {REVIEWS.map((r, i) => (
            <div
              key={r.name}
              ref={(el) => { reviewRefs.current[i] = el; }}
              className="chemtec-review opacity-0 text-left"
              style={{ willChange: "opacity, transform" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-orange text-sm tracking-wider">{STARS}</span>
                <span className="text-ink/40 text-xs font-semibold">{r.name}</span>
              </div>
              <p className="text-ink/70 text-xs leading-snug italic">
                &ldquo;{r.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Text 3 — desktop: left-center | mobile: centered */}
      <div
        ref={t3Ref}
        className="absolute z-[5] pointer-events-none opacity-0 inset-x-0 md:inset-x-auto md:left-0 px-5 md:px-12 lg:px-16 flex items-center justify-center md:justify-start w-full md:w-[44%]"
        style={{ willChange: "opacity, transform", top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="chemtec-card pointer-events-auto max-w-sm md:max-w-none text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
            Built to last{" "}
            <span className="font-serif italic text-orange">a lifetime.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 max-w-md leading-relaxed">
            Every install comes with a 10-year warranty backed by ChemTec.
            Not a weekend paint job — a professional surface that outlasts the house.
          </p>
          <div className="mt-5 flex justify-center md:justify-start">
            <a href="#quote" className="btn-pill btn-pill-primary text-sm md:text-base">
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
