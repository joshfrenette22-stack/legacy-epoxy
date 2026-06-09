const PHONE = "9705551234"; // TODO: replace with real number
const PHONE_DISPLAY = "(970) 555-1234";

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/[0.06] py-12 md:py-16 pb-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo + tagline */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <svg
                viewBox="0 0 32 36"
                fill="none"
                className="h-7 w-6 text-orange"
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
            </div>
            <p className="text-sm text-cream/40 max-w-xs">
              Northern Colorado&apos;s only certified ChemTec installer. 10-year warranty on every surface.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={`tel:${PHONE}`}
              className="text-lg font-semibold text-cream hover:text-orange transition-colors"
            >
              {PHONE_DISPLAY}
            </a>
            <p className="text-sm text-cream/40">
              Serving Northern Colorado — Fort Collins, Loveland, Greeley, Windsor & beyond
            </p>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-cream/30">
          <p>&copy; {new Date().getFullYear()} Legacy Epoxy. All rights reserved.</p>
          <p>10-Year Warranty &middot; Certified ChemTec Installer</p>
        </div>
      </div>
    </footer>
  );
}
