export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { WebsiteRenderer } from "@/components/WebsiteRenderer";
import { getOpenAIClient } from "@/lib/openai";
import { buildFallbackSite } from "@/lib/site-builder";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function applyEdit(formData: FormData) {
  "use server";

  const websiteId = String(formData.get("websiteId") || "");
  const message = String(formData.get("message") || "").trim();

  if (!websiteId || !message) return;

  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    include: {
      pages: {
        orderBy: { order: "asc" }
      }
    }
  });

  if (!website) return;

  const page = website.pages[0];
  const current = JSON.parse(page.contentJson) as { sections: any[] };

  let updatedSections = current.sections;
  const openai = getOpenAIClient();

  if (openai) {
    try {
      const result = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content: "You update website page JSON. Return only JSON with a top-level sections array. Keep structure simple."
          },
          {
            role: "user",
            content: JSON.stringify({
              instruction: message,
              currentSections: current.sections
            })
          }
        ]
      });

      const text = result.output_text?.trim();
      if (text) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed.sections)) {
          updatedSections = parsed.sections;
        }
      }
    } catch {
      updatedSections = current.sections;
    }
  } else {
    updatedSections = current.sections.map((section: any) => {
      if (section.type === "hero") {
        return {
          ...section,
          subheadline: `${section.subheadline} Updated request: ${message}`
        };
      }
      return section;
    });
  }

  await prisma.page.update({
    where: { id: page.id },
    data: {
      contentJson: JSON.stringify({ sections: updatedSections })
    }
  });

  await prisma.chatMessage.createMany({
    data: [
      {
        websiteId,
        role: "user",
        content: message
      },
      {
        websiteId,
        role: "ai",
        content: `Applied your request: "${message}".`
      }
    ]
  });

  await prisma.siteVersion.create({
    data: {
      websiteId,
      label: "Edited with AI",
      snapshotJson: JSON.stringify({ sections: updatedSections })
    }
  });

  revalidatePath(`/app/builder?websiteId=${websiteId}`);
  redirect(`/app/builder?websiteId=${websiteId}`);
}

export default async function BuilderPage({
  searchParams
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const { websiteId } = await searchParams;
  const website =
    (websiteId
      ? await prisma.website.findUnique({
          where: { id: websiteId },
          include: {
            pages: { orderBy: { order: "asc" } },
            chatMessages: { orderBy: { createdAt: "asc" } },
            customDomain: true,
            versions: { orderBy: { createdAt: "desc" }, take: 5 }
          }
        })
      : null) ||
    (await prisma.website.findFirst({
      include: {
        pages: { orderBy: { order: "asc" } },
        chatMessages: { orderBy: { createdAt: "asc" } },
        customDomain: true,
        versions: { orderBy: { createdAt: "desc" }, take: 5 }
      }
    }));

  if (!website) {
    const generated = buildFallbackSite("Build a premium AI website.", "LaunchLayer Demo");
    return <pre>{JSON.stringify(generated, null, 2)}</pre>;
  }

  const homePage = website.pages[0];
  const pageContent = JSON.parse(homePage.contentJson) as { sections: any[] };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Builder</div>
        <h1 className="mt-4 text-3xl font-semibold">{website.name}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Prompt based generation, version history, and AI editing all live here. This route reads from the database and renders the stored website JSON.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <WebsiteRenderer title={website.name} sections={pageContent.sections} />

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold">Project details</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Prompt</div>
                <div className="mt-1">{website.prompt}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Status</div>
                <div className="mt-1">{website.status}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Domain</div>
                <div className="mt-1">{website.customDomain?.hostname || "Pending domain"}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold">AI editor</div>
            <div className="mt-4 h-72 space-y-3 overflow-auto rounded-3xl border bg-slate-50 p-4">
              {website.chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "ai"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "ml-auto bg-slate-950 text-white"
                  }`}
                >
                  {message.content}
                </div>
              ))}
            </div>

            <form action={applyEdit} className="mt-4 space-y-3">
              <input type="hidden" name="websiteId" value={website.id} />
              <textarea
                name="message"
                className="min-h-32 w-full rounded-2xl border px-4 py-3 text-sm"
                placeholder="Ask the AI to edit layout, copy, pricing, sections, forms, or tone"
                required
              />
              <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">
                Send edit request
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-lg font-semibold">Version history</div>
            <div className="mt-4 space-y-3">
              {website.versions.map((version) => (
                <div key={version.id} className="rounded-2xl border p-4 text-sm">
                  <div className="font-medium">{version.label}</div>
                  <div className="mt-1 text-slate-500">{version.createdAt.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
