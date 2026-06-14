/**
 * Renders one or more schema.org JSON-LD objects as a script tag.
 * Server component — safe to use directly in pages and layouts.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
