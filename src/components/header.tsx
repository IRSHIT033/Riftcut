import Image from "next/image";

const DODO_CHECKOUT_URL =
  "https://checkout.dodopayments.com/buy/pdt_0NbUpsyyf0I4YMMxEjo9O?quantity=1";

export function Header() {
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-64.png"
            alt="Riftcut logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span
            className="text-lg font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-brand), sans-serif" }}
          >
            Riftcut
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={DODO_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground text-background overflow-hidden"
          >
            <svg
              width="14"
              height="13"
              viewBox="0 0 8 7"
              className="relative pixel-heart drop-shadow-[0_0_5px_rgba(236,72,153,0.6)]"
              shapeRendering="crispEdges"
            >
              <rect x="1" y="0" width="2" height="1" fill="#ec4899" />
              <rect x="5" y="0" width="2" height="1" fill="#ec4899" />
              <rect x="0" y="1" width="8" height="1" fill="#ec4899" />
              <rect x="0" y="2" width="8" height="1" fill="#ec4899" />
              <rect x="0" y="3" width="8" height="1" fill="#ec4899" />
              <rect x="1" y="4" width="6" height="1" fill="#ec4899" />
              <rect x="2" y="5" width="4" height="1" fill="#ec4899" />
              <rect x="3" y="6" width="2" height="1" fill="#ec4899" />
              {/* Pixel highlight */}
              <rect x="1" y="1" width="1" height="1" fill="#f9a8d4" />
              <rect x="2" y="1" width="1" height="1" fill="#f472b6" />
            </svg>
            <span className="relative" style={{ fontFamily: "var(--font-pixel)" }}>Support</span>
          </a>
          <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full text-xs text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            <span className="hidden sm:inline">Your images never leave your device</span>
            <span className="sm:hidden">100% Private</span>
          </div>
        </div>
      </div>
    </header>
  );
}
