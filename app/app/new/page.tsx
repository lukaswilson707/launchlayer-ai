import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { buildFallbackSite } from "@/lib/site-builder";

async function createWebsite(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const niche = String(formData.get("niche") || "").trim();
  const theme = String(formData.get("theme") || "").trim();
  const prompt = String(formData.get("prompt") || "").trim();

  if (!name || !prompt) return;

  const workspace = await prisma.workspace.findFirst();
  if (!workspace) return;

  const generated = buildFallbackSite(prompt, name);

  const website = await prisma.website.create({
    data: {
      workspaceId: workspace.id,
      name,
      slug: slugify(name + "-" + Date.now()),
      niche,
      theme,
      prompt,
      seoTitle: generated.seoTitle,
      seoDescription: generated.seoDescription,
      generatedJson: JSON.stringify(generated),
      pages: {
        create: generated.pages.map((page, index) => ({
          title: page.title,
          slug: page.slug,
          order: index,
          contentJson: JSON.stringify({ sections: page.sections })
        }))
      },
      versions: {
        create: {
          label: "Initial AI version",
          snapshotJson: JSON.stringify(generated)
        }
      },
      chatMessages: {
        create: {
          role: "ai",
          content: "I generated your first website version."
        }
      },
      analytics: {
        create: {
          date: new Date(),
          visits: 0,
          leads: 0,
          conversions: 0
        }
      }
    }
  });

  redirect(`/app/builder?websiteId=${website.id}`);
}

export default function NewWebsitePage() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Onboarding</div>
      <h1 className="mt-4 text-3xl font-semibold">Create a new website</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">
        This form acts as the first-run wizard. In production, you would expand it with more business questions, brand style preferences, and target audience details.
      </p>

      <form action={createWebsite} className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Business name</label>
          <input name="name" className="w-full rounded-2xl border px-4 py-3 text-sm" placeholder="Nova Coaching" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Business niche</label>
          <input name="niche" className="w-full rounded-2xl border px-4 py-3 text-sm" placeholder="Fitness coaching" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Visual theme</label>
          <input name="theme" className="w-full rounded-2xl border px-4 py-3 text-sm" placeholder="Luxury dark" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Website prompt</label>
          <textarea
            name="prompt"
            className="min-h-40 w-full rounded-2xl border px-4 py-3 text-sm"
            placeholder="Build a premium website for an online coaching brand with black and white styling, testimonials, FAQ, pricing, and a lead capture funnel."
            required
          />
        </div>
        <div className="md:col-span-2">
          <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white">
            Generate first website
          </button>
        </div>
      </form>
    </div>
  );
}
