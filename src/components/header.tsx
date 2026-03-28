import Image from "next/image";

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
        <div className="flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
          <span className="hidden sm:inline">Your images never leave your device</span>
          <span className="sm:hidden">100% Private</span>
        </div>
      </div>
    </header>
  );
}
