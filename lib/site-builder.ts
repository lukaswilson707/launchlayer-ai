import { slugify } from "@/lib/utils";

export type Section =
  | { type: "hero"; headline: string; subheadline: string; ctaPrimary: string; ctaSecondary: string }
  | { type: "features"; items: string[] }
  | { type: "testimonials"; items: Array<{ quote: string; name: string }> }
  | { type: "faq"; items: Array<{ question: string; answer: string }> }
  | { type: "leadForm"; headline: string };

export type GeneratedSite = {
  siteName: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  pages: Array<{
    title: string;
    slug: string;
    sections: Section[];
  }>;
};

export function buildFallbackSite(prompt: string, siteName?: string): GeneratedSite {
  const name = siteName || "New Website";
  return {
    siteName: name,
    slug: slugify(name),
    seoTitle: name,
    seoDescription: `AI generated website for ${name}`,
    pages: [
      {
        title: "Home",
        slug: "/",
        sections: [
          {
            type: "hero",
            headline: `Launch ${name} with AI`,
            subheadline: prompt,
            ctaPrimary: "Get started",
            ctaSecondary: "Learn more"
          },
          {
            type: "features",
            items: ["AI generated layout", "Custom domain support", "Built in analytics", "Lead capture"]
          },
          {
            type: "testimonials",
            items: [
              { quote: "The site launched fast and looked premium.", name: "First customer" },
              { quote: "The AI edits saved me hours.", name: "Business owner" }
            ]
          },
          {
            type: "faq",
            items: [
              { question: "How fast can I publish?", answer: "You can go from prompt to draft in minutes." },
              { question: "Can I use my own domain?", answer: "Yes, custom domains are supported." }
            ]
          },
          {
            type: "leadForm",
            headline: "Start your project today"
          }
        ]
      }
    ]
  };
}
