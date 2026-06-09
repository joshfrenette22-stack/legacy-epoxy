"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    mm.add("(min-width: 1px)", () => {
      // ── Fade-up reveals ──
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Staggered children ──
      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((parent) => {
        const children = parent.children;
        gsap.fromTo(children,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: parent,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Scale-in cards ──
      gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.9, y: 30 },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: i * 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Counter animations ──
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = el.getAttribute("data-count") || el.textContent || "0";
        const isNumber = /^\d+$/.test(target);

        if (isNumber) {
          const val = { v: 0 };
          gsap.to(val, {
            v: parseInt(target),
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => { el.textContent = Math.round(val.v).toString(); },
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          });
        } else {
          // Non-numeric: just fade in
          gsap.fromTo(el,
            { opacity: 0, y: 20 },
            {
              opacity: 1, y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });

      // ── Horizontal line reveals ──
      gsap.utils.toArray<HTMLElement>("[data-line]").forEach((el) => {
        gsap.fromTo(el,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ── Parallax elements ──
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.getAttribute("data-parallax") || "0.2");
        gsap.to(el, {
          y: () => -speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
