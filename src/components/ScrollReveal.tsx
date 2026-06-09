"use client";

import { useEffect } from "react";

/*
 * Pure IntersectionObserver + CSS animations.
 * Zero layout/style cost during scroll — all runs off main thread.
 * GSAP ScrollTrigger removed to eliminate forced reflows.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll("[data-reveal],[data-stagger],[data-scale-in]").forEach((el) => {
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
