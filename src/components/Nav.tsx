"use client";

import { useState, useEffect } from "react";

const PHONES = {
  CO: { raw: "9704055043", display: "970-405-5043" },
  NM: { raw: "5056155262", display: "505-615-5262" },
};

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
        <a href="#" className="flex items-center shrink-0">
          <img
            src="/logo-white.svg"
            alt="Legacy Epoxy"
            className="h-9 md:h-10 w-auto"
          />
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
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 text-sm font-medium">
            <a href={`tel:${PHONES.CO.raw}`} className="text-cream/70 hover:text-cream transition-colors">
              <span className="text-cream/40 mr-1">CO</span>{PHONES.CO.display}
            </a>
            <span className="text-cream/20">|</span>
            <a href={`tel:${PHONES.NM.raw}`} className="text-cream/70 hover:text-cream transition-colors">
              <span className="text-cream/40 mr-1">NM</span>{PHONES.NM.display}
            </a>
          </div>
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
            <a href={`tel:${PHONES.CO.raw}`} className="btn-pill btn-pill-ghost text-sm">
              Call Colorado {PHONES.CO.display}
            </a>
            <a href={`tel:${PHONES.NM.raw}`} className="btn-pill btn-pill-ghost text-sm">
              Call New Mexico {PHONES.NM.display}
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
