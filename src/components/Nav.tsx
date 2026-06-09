"use client";

import { useState, useEffect } from "react";

const PHONE = "9705551234"; // TODO: replace with real number
const PHONE_DISPLAY = "(970) 555-1234";

const links = [
  { label: "Why Us", href: "#features" },
  { label: "How It Works", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Free Quote", href: "#quote" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-ink/90 backdrop-blur-lg shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 md:py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 shrink-0">
          {/* Spartan helmet mark */}
          <svg
            viewBox="0 0 32 36"
            fill="none"
            className="h-8 w-7 text-orange"
            aria-hidden="true"
          >
            <path
              d="M16 0C8 0 2 6 2 14v10c0 2 0.5 4 1.5 5.5L8 36h4l-3-5c1.5 1 3.5 1.5 5.5 1.5h3c2 0 4-0.5 5.5-1.5L20 36h4l4.5-6.5C29.5 28 30 26 30 24V14c0-8-6-14-14-14zm-6 12c0-1 1-2 2-2h8c1 0 2 1 2 2v8c0 3-2 6-6 7-4-1-6-4-6-7v-8z"
              fill="currentColor"
            />
          </svg>
          <span className="text-lg font-bold tracking-tight text-cream">
            LEGACY <span className="text-orange">EPOXY</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/70 hover:text-cream transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={`tel:${PHONE}`}
            className="text-sm font-medium text-cream/70 hover:text-cream transition-colors"
          >
            {PHONE_DISPLAY}
          </a>
          <a href="#quote" className="btn-pill btn-pill-primary text-sm !py-2.5 !px-5">
            Get a Free Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-cream"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ink/95 backdrop-blur-lg border-t border-white/5 px-5 pb-6 pt-2">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-base font-medium text-cream/80 hover:text-cream border-b border-white/5"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-3">
            <a href={`tel:${PHONE}`} className="btn-pill btn-pill-ghost text-sm">
              Call {PHONE_DISPLAY}
            </a>
            <a
              href="#quote"
              onClick={() => setMenuOpen(false)}
              className="btn-pill btn-pill-primary text-sm"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
