export function Footer() {
  return (
    <footer className="w-full border-t-3 border-foreground bg-neo-blue py-5">
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm font-bold text-foreground">
        <p>100% private -- all processing happens in your browser</p>
        <p className="flex items-center gap-4">
          <span className="hidden sm:inline">
            <kbd className="px-2 py-1 bg-white neo-border text-xs font-mono neo-shadow-sm">Ctrl+V</kbd> paste
            <span className="mx-2">/</span>
            <kbd className="px-2 py-1 bg-white neo-border text-xs font-mono neo-shadow-sm">Ctrl+S</kbd> save
            <span className="mx-2">/</span>
            <kbd className="px-2 py-1 bg-white neo-border text-xs font-mono neo-shadow-sm">Esc</kbd> reset
          </span>
        </p>
      </div>
    </footer>
  );
}
