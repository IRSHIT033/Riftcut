import { JsonLd } from "./json-ld";
import { faqPageSchema, type FaqItem } from "@/lib/structured-data";

interface FaqSectionProps {
  faqs: FaqItem[];
  title?: string;
}

export function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
}: FaqSectionProps) {
  return (
    <section className="w-full border-t-3 border-foreground bg-background">
      <JsonLd data={faqPageSchema(faqs)} />
      <div className="max-w-[1060px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2
          className="text-2xl sm:text-3xl font-bold text-foreground mb-8"
          style={{ fontFamily: "var(--font-brand), sans-serif" }}
        >
          {title}
        </h2>
        <dl className="space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="neo-card bg-white p-5 group">
              <summary className="flex cursor-pointer items-center justify-between gap-3 list-none font-bold text-foreground">
                <dt>{faq.question}</dt>
                <span className="shrink-0 text-xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <dd className="mt-3 text-sm font-medium text-foreground/70">
                {faq.answer}
              </dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}
