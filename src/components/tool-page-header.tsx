interface ToolPageHeaderProps {
  title: string;
  description: string;
  tag: string;
  tagColor: string;
}

export function ToolPageHeader({ title, description, tag, tagColor }: ToolPageHeaderProps) {
  return (
    <div className="text-center mb-8 sm:mb-10">
      <div className="inline-block mb-4">
        <span
          className="inline-block neo-btn px-3 py-1 text-xs font-bold rotate-[-1deg]"
          style={{ backgroundColor: tagColor }}
        >
          {tag}
        </span>
      </div>
      <h1
        className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3"
        style={{ fontFamily: "var(--font-brand), sans-serif" }}
      >
        {title}
      </h1>
      <p className="text-base sm:text-lg font-medium text-foreground/60 max-w-xl mx-auto">
        {description}
      </p>
    </div>
  );
}
