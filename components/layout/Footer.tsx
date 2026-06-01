import Link from "next/link";

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4.5"/>
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.85a8.18 8.18 0 0 0 4.78 1.53V7a4.85 4.85 0 0 1-1.01-.31z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-plum text-blush/80">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="font-serif text-2xl tracking-[0.2em] text-blush mb-3">EMBELLISH</h3>
            <p className="text-xs tracking-widest text-taupe mb-4 uppercase">Where style meets sophistication</p>
            <p className="text-sm leading-relaxed text-blush/60">
              A new destination for timeless elegance and modern luxury. Curated for the woman who knows her worth.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="text-taupe hover:text-blush transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok" className="text-taupe hover:text-blush transition-colors">
                <TikTokIcon />
              </a>
              <a href="#" aria-label="X (Twitter)" className="text-taupe hover:text-blush transition-colors">
                <XIcon />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-blush uppercase mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Tote Bags", href: "/shop?category=tote" },
                { label: "Handbags", href: "/shop?category=handbag" },
                { label: "Clutches", href: "/shop?category=clutch" },
                { label: "Jewellery", href: "/shop?category=jewellery" },
                { label: "Beanies", href: "/shop?category=beanie" },
                { label: "New Arrivals", href: "/shop?sort=new" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-blush/60 hover:text-blush transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-blush uppercase mb-4">Help</h4>
            <ul className="space-y-2.5">
              {["Shipping & Returns", "Size Guide", "Track Your Order", "FAQ", "Contact Us"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-blush/60 hover:text-blush transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest text-blush uppercase mb-4">Stay in the loop</h4>
            <p className="text-sm text-blush/60 mb-4 leading-relaxed">
              New arrivals, exclusive offers and style inspiration — straight to your inbox.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-mauve border border-taupe/30 text-blush placeholder:text-taupe/50 text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-taupe"
              />
              <button className="bg-blush text-plum text-xs tracking-widest uppercase py-3 px-4 rounded-lg hover:bg-blush/90 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-taupe/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-blush/40">
          <p>© {new Date().getFullYear()} EMBELLISH. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blush/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blush/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blush/60 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
