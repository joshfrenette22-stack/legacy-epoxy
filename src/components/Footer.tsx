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
              <img src="/logo-white.svg" alt="Legacy Epoxy" className="h-8" />
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
