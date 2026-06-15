const LOCATIONS = [
  {
    name: "Legacy Epoxy Supply of Loveland",
    address: "5608 McWhinney Blvd, Loveland, CO 80538",
    phone: { raw: "9706379573", display: "970-637-9573" },
  },
  {
    name: "Legacy Epoxy Supply of Denver",
    address: "1195 S. Lipan St, Denver, CO 80223",
    phone: { raw: "3038755571", display: "303-875-5571" },
  },
  {
    name: "Legacy Epoxy Supply of Albuquerque",
    address: "4374 Alexander Blvd NE, Albuquerque, NM 87107",
    phone: { raw: "5056155262", display: "505-615-5262" },
  },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.06] py-12 md:py-16 pb-28 md:pb-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          {/* Logo + tagline */}
          <div className="max-w-sm">
            <a href="https://legacyepoxysupply.com" className="inline-block mb-3">
              <img src="/logo-white.svg" alt="Legacy Epoxy Supply" className="h-8" />
            </a>
            <p className="text-sm text-white/40 leading-relaxed">
              The contractor&apos;s one-stop shop for epoxy and concrete supplies
              plus professional-grade equipment in Colorado and New Mexico.
            </p>
            <a
              href="mailto:info@legacyepoxysupply.com"
              className="inline-block mt-3 text-sm text-white/50 hover:text-orange transition-colors"
            >
              info@legacyepoxysupply.com
            </a>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {LOCATIONS.map((loc) => (
              <div key={loc.name}>
                <p className="text-sm font-semibold text-white/80 mb-1">{loc.name}</p>
                <p className="text-xs text-white/40 leading-relaxed mb-1.5">{loc.address}</p>
                <a
                  href={`tel:${loc.phone.raw}`}
                  className="text-sm font-medium text-white/60 hover:text-orange transition-colors"
                >
                  {loc.phone.display}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/[0.06] flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-white/30">
          <p>&copy; {new Date().getFullYear()} Legacy Epoxy Supply. All rights reserved.</p>
          <p>10-Year Warranty &middot; Certified ChemTec Installer</p>
        </div>
      </div>
    </footer>
  );
}
