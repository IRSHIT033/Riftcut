export function Footer() {
  return (
    <footer className="w-full border-t border-border py-6">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
        <p>100% private — all processing happens in your browser</p>
        <p className="flex items-center gap-4">
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 bg-surface rounded text-[10px] font-mono">Ctrl+V</kbd> paste
            <span className="mx-2">·</span>
            <kbd className="px-1.5 py-0.5 bg-surface rounded text-[10px] font-mono">Ctrl+S</kbd> save
            <span className="mx-2">·</span>
            <kbd className="px-1.5 py-0.5 bg-surface rounded text-[10px] font-mono">Esc</kbd> reset
          </span>
        </p>
      </div>
    </footer>
  );
}
