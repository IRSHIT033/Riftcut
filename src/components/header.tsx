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
          <span className="text-lg font-bold tracking-tight text-foreground">
            Riftcut
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={DODO_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-foreground text-background hover:opacity-90 transition-opacity overflow-hidden"
          >
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle,rgba(236,72,153,0.3)_0%,rgba(236,72,153,0.15)_40%,transparent_70%)]" />
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="#ec4899"
              stroke="#ec4899"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative drop-shadow-[0_0_4px_rgba(236,72,153,0.6)]"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="relative">Support</span>
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
