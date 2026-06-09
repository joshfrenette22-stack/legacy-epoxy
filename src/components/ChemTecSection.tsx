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
  const [ready, setReady] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setMobile(isMobile);
    setMounted(true);
    if (isMobile) setReady(true);
  }, []);

  // Desktop: video readiness
  useEffect(() => {
    if (!mounted || mobile) return;

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
  }, [mounted, mobile]);

  // Desktop: GSAP scroll-scrub
  useEffect(() => {
    if (!ready || mobile) return;
    const el = pinRef.current;
    const t1 = t1Ref.current;
    const t2 = t2Ref.current;
    const t3 = t3Ref.current;
    const reviews = reviewRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!el || !t1 || !t2 || !t3) return;

    const video = videoRef.current;
    const canSeek = video && video.readyState >= 2;
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
            end: "+=500%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

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

        // Text 1: LEFT, upper
        tl.fromTo(t1, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.03);
        tl.to(t1, { opacity: 0, x: -60, duration: 0.08, ease: "power2.in" }, 0.28);

        // Text 2: RIGHT, lower + reviews on lower-left
        tl.fromTo(t2, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.36);
        reviews.forEach((review, i) => {
          tl.fromTo(review,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "power2.out" },
            0.42 + i * 0.03
          );
        });
        tl.to(t2, { opacity: 0, x: 60, duration: 0.08, ease: "power2.in" }, 0.61);
        // Fade reviews out with text 2
        reviews.forEach((review) => {
          tl.to(review, { opacity: 0, duration: 0.06, ease: "power2.in" }, 0.61);
        });

        // Text 3: LEFT, center
        tl.fromTo(t3, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.1, ease: "power3.out" }, 0.68);
        tl.to(t3, { opacity: 0, x: -60, duration: 0.06, ease: "power2.in" }, 0.92);
      });

      cleanup = () => ctx.revert();
    })();

    return () => cleanup?.();
  }, [ready, mobile]);

  // ── Mobile: simple scrolling layout, no GSAP pinning ──
  if (mounted && mobile) {
    return (
      <section className="py-16 px-5 overflow-hidden" style={{ background: "#faf7f1" }}>
        <div className="max-w-lg mx-auto space-y-12">
          {/* Block 1 */}
          <div data-reveal>
            <p className="text-orange text-xs font-semibold tracking-[0.25em] uppercase mb-3">
              ChemTec Certified
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-[1.1]">
              The science behind <span className="font-serif italic">the surface.</span>
            </h2>
            <p className="mt-3 text-sm text-ink/60 leading-relaxed">
              We&apos;re Northern Colorado&apos;s only certified ChemTec installer.
              Industrial-grade resin systems most contractors can&apos;t even order.
            </p>
          </div>

          {/* Block 2 */}
          <div data-reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-[1.1]">
              Engineered for <span className="font-serif italic">extremes.</span>
            </h2>
            <p className="mt-3 text-sm text-ink/60 leading-relaxed">
              Hot tires. Road salt. Gasoline. Brake fluid.
              ChemTec&apos;s polyaspartic system shrugs it all off.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chemtec-chip">400°F Hot-Tire Rated</span>
              <span className="chemtec-chip">UV Stable</span>
              <span className="chemtec-chip">Chemical Impervious</span>
            </div>
          </div>

          {/* Reviews */}
          <div className="space-y-3" data-stagger>
            {REVIEWS.map((r) => (
              <div key={r.name} className="chemtec-review">
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

          {/* Block 3 */}
          <div data-reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight leading-[1.1]">
              Built to last <span className="font-serif italic">a lifetime.</span>
            </h2>
            <p className="mt-3 text-sm text-ink/60 leading-relaxed">
              Every install comes with a 10-year warranty backed by ChemTec.
              Not a weekend paint job — a professional surface that outlasts the house.
            </p>
            <div className="mt-5">
              <a href="#quote" className="btn-pill btn-pill-primary text-sm">Get a Free Quote</a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop: full scroll-scrub experience ──
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

      {/* Immersive cream gradient edges */}
      <div className="chemtec-gradient absolute inset-x-0 top-0 h-48 z-[3]"
        style={{ background: "linear-gradient(to bottom, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-x-0 bottom-0 h-48 z-[3]"
        style={{ background: "linear-gradient(to top, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 left-0 w-[22%] z-[2]"
        style={{ background: "linear-gradient(to right, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-y-0 right-0 w-[22%] z-[2]"
        style={{ background: "linear-gradient(to left, #faf7f1, transparent)" }} />
      <div className="chemtec-gradient absolute inset-0 z-[2]"
        style={{ background: "radial-gradient(ellipse 55% 50% at 50% 50%, transparent 25%, rgba(250,247,241,0.6) 100%)" }} />

      {/* Text 1: LEFT, upper */}
      <div
        ref={t1Ref}
        className="absolute z-[5] pointer-events-none opacity-0 left-0 px-8 md:px-12 lg:px-16"
        style={{ willChange: "opacity, transform", width: "44%", top: "12%" }}
      >
        <div className="chemtec-card pointer-events-auto">
          <p className="text-orange text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
            ChemTec Certified
          </p>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
            The science behind{" "}
            <span className="font-serif italic">the surface.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 max-w-md leading-relaxed">
            We&apos;re Northern Colorado&apos;s only certified ChemTec installer.
            Industrial-grade resin systems most contractors can&apos;t even order.
          </p>
        </div>
      </div>

      {/* Text 2: RIGHT, lower */}
      <div
        ref={t2Ref}
        className="absolute z-[5] pointer-events-none opacity-0 right-0 px-8 md:px-12 lg:px-16 text-right"
        style={{ willChange: "opacity, transform", width: "44%", bottom: "10%" }}
      >
        <div className="chemtec-card pointer-events-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
            Engineered for{" "}
            <span className="font-serif italic">extremes.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 max-w-md ml-auto leading-relaxed">
            Hot tires. Road salt. Gasoline. Brake fluid.
            ChemTec&apos;s polyaspartic system shrugs it all off.
          </p>
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <span className="chemtec-chip">400°F Hot-Tire Rated</span>
            <span className="chemtec-chip">UV Stable</span>
            <span className="chemtec-chip">Chemical Impervious</span>
          </div>
        </div>
      </div>

      {/* Reviews: lower-left, same phase as text 2 */}
      <div
        className="absolute z-[5] pointer-events-none left-0 px-8 md:px-12 lg:px-16"
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

      {/* Text 3: LEFT, center */}
      <div
        ref={t3Ref}
        className="absolute z-[5] pointer-events-none opacity-0 left-0 px-8 md:px-12 lg:px-16"
        style={{ willChange: "opacity, transform", width: "44%", top: "50%", transform: "translateY(-50%)" }}
      >
        <div className="chemtec-card pointer-events-auto">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-[1.1]">
            Built to last{" "}
            <span className="font-serif italic">a lifetime.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/60 max-w-md leading-relaxed">
            Every install comes with a 10-year warranty backed by ChemTec.
            Not a weekend paint job — a professional surface that outlasts the house.
          </p>
          <div className="mt-5">
            <a href="#quote" className="btn-pill btn-pill-primary text-sm md:text-base">
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
