"use client";

const PHONES = {
  CO: { raw: "9704055043", label: "Call CO" },
  NM: { raw: "5056155262", label: "Call NM" },
};

export default function MobileCTA() {
  return (
    <div className="mobile-cta-bar">
      <a
        href={`tel:${PHONES.CO.raw}`}
        className="btn-pill btn-pill-ghost flex-1 text-sm !py-3"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
        {PHONES.CO.label}
      </a>
      <a
        href={`tel:${PHONES.NM.raw}`}
        className="btn-pill btn-pill-ghost flex-1 text-sm !py-3"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
        </svg>
        {PHONES.NM.label}
      </a>
      <a
        href="#quote"
        className="btn-pill btn-pill-primary flex-1 text-sm !py-3"
      >
        Free Quote
      </a>
    </div>
  );
}
