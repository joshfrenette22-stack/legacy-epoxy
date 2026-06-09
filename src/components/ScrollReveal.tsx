"use client";

import { useEffect } from "react";

/*
 * Pure IntersectionObserver + CSS animations.
 * Uses MutationObserver to catch dynamically rendered elements
 * (e.g. mobile-only components that mount after initial render).
 */
export default function ScrollReveal() {
  // Force scroll to top on load/refresh (prevents browser restoring mid-page position)
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const selector = "[data-reveal],[data-stagger],[data-scale-in]";

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

    const observed = new WeakSet<Element>();

    function observeAll() {
      document.querySelectorAll(selector).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    }

    observeAll();

    // Watch for dynamically added elements (mobile conditional renders)
    const mo = new MutationObserver(() => observeAll());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
