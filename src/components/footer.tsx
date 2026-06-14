import Link from "next/link";

const POPULAR_LINKS: { href: string; label: string }[] = [
  { href: "/remove-background-from-photo", label: "Remove Background from Photo" },
  { href: "/remove-background-from-product-photo", label: "Product Photo Background" },
  { href: "/ai-background-remover", label: "AI Background Remover" },
  { href: "/transparent-background-maker", label: "Transparent Background Maker" },
  { href: "/jpg-to-pdf", label: "JPG to PDF" },
  { href: "/word-to-pdf", label: "Word to PDF" },
  { href: "/merge-pdf-online", label: "Merge PDF" },
  { href: "/add-signature-to-pdf", label: "Add Signature to PDF" },
];

const TOOL_LINKS: { href: string; label: string }[] = [
  { href: "/bg-remover", label: "Background Remover" },
  { href: "/convert", label: "File Converter" },
  { href: "/merge-pdf", label: "Merge PDFs" },
  { href: "/pdf-editor", label: "PDF Editor" },
];

export function Footer() {
  return (
    <footer className="w-full border-t-3 border-foreground bg-background">
      {/* Link columns */}
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-3">
            Tools
          </h3>
          <ul className="space-y-2">
            {TOOL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-bold text-foreground hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 sm:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-foreground/50 mb-3">
            Popular
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="w-full border-t-3 border-foreground bg-neo-blue py-5">
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
      </div>
    </footer>
  );
}
