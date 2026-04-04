import Link from "next/link";
import { LayoutGrid } from "lucide-react";

const DODO_CHECKOUT_URL =
  "https://checkout.dodopayments.com/buy/pdt_0NbUpsyyf0I4YMMxEjo9O?quantity=1";

export function Header({ showAllTools = true }: { showAllTools?: boolean }) {
  return (
    <header className="w-full border-b-3 border-foreground bg-neo-yellow">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl sm:text-4xl font-bold tracking-tight select-none hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-brand), sans-serif" }}
        >
          Riftcut
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {showAllTools && (
            <Link
              href="/"
              className="support-btn group relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold bg-white text-foreground overflow-hidden"
            >
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2.5} />
              <span className="relative" style={{ fontFamily: "var(--font-pixel)" }}>All Tools</span>
            </Link>
          )}
          <a
            href={DODO_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="support-btn group relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold bg-neo-pink text-white overflow-hidden"
          >
            <svg
              width="14"
              height="13"
              viewBox="0 0 8 7"
              className="relative pixel-heart drop-shadow-[0_0_5px_rgba(236,72,153,0.6)]"
              shapeRendering="crispEdges"
            >
              <rect x="1" y="0" width="2" height="1" fill="#fff" />
              <rect x="5" y="0" width="2" height="1" fill="#fff" />
              <rect x="0" y="1" width="8" height="1" fill="#fff" />
              <rect x="0" y="2" width="8" height="1" fill="#fff" />
              <rect x="0" y="3" width="8" height="1" fill="#fff" />
              <rect x="1" y="4" width="6" height="1" fill="#fff" />
              <rect x="2" y="5" width="4" height="1" fill="#fff" />
              <rect x="3" y="6" width="2" height="1" fill="#fff" />
              <rect x="1" y="1" width="1" height="1" fill="rgba(255,255,255,0.6)" />
              <rect x="2" y="1" width="1" height="1" fill="rgba(255,255,255,0.8)" />
            </svg>
            <span className="relative" style={{ fontFamily: "var(--font-pixel)" }}>Support</span>
          </a>
        </div>
      </div>
    </header>
  );
}
