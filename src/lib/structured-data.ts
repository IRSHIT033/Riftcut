export const SITE_URL = "https://www.riftcut.pro";

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  /** Path relative to the site root, e.g. "/bg-remover". Use "/" for home. */
  path: string;
}

/** schema.org WebSite — enables brand recognition and sitelinks in search. */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Riftcut",
    url: SITE_URL,
    description:
      "Free private file toolkit: AI background remover, file converter, PDF merger, and PDF editor. 100% private — all processing happens in your browser.",
  };
}

/** schema.org Organization — supports the brand knowledge panel. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Riftcut",
    url: SITE_URL,
    logo: `${SITE_URL}/icon-512.png`,
  };
}

/** schema.org WebApplication for an individual tool page. */
export function webApplicationSchema({
  name,
  path,
  description,
  featureList,
}: {
  name: string;
  path: string;
  description: string;
  featureList?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    ...(featureList ? { featureList } : {}),
  };
}

/** schema.org FAQPage. The questions/answers MUST match visible page content. */
export function faqPageSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * schema.org HowTo. Note: Google deprecated HowTo rich results in 2023, so this
 * produces no rich snippet — it is kept purely as a semantic signal for AI/LLM
 * answer extraction. The visible steps on the page are the real value.
 */
export function howToSchema(name: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: steps.map((text, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text,
    })),
  };
}

/** schema.org BreadcrumbList for SERP breadcrumb display. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
