import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function assignDomain(formData: FormData) {
  "use server";

  const websiteId = String(formData.get("websiteId") || "");
  const hostname = String(formData.get("hostname") || "").trim().toLowerCase();

  if (!websiteId || !hostname) return;

  await prisma.domain.upsert({
    where: { websiteId },
    update: {
      hostname,
      verified: true,
      sslEnabled: true
    },
    create: {
      websiteId,
      hostname,
      provider: "manual",
      verified: true,
      sslEnabled: true
    }
  });

  await prisma.website.update({
    where: { id: websiteId },
    data: {
      status: "PUBLISHED"
    }
  });

  revalidatePath(`/app/domains?websiteId=${websiteId}`);
  redirect(`/app/domains?websiteId=${websiteId}`);
}

export default async function DomainsPage({
  searchParams
}: {
  searchParams: Promise<{ websiteId?: string }>;
}) {
  const { websiteId } = await searchParams;
  const website =
    (websiteId
      ? await prisma.website.findUnique({
          where: { id: websiteId },
          include: { customDomain: true }
        })
      : null) ||
    (await prisma.website.findFirst({
      include: { customDomain: true }
    }));

  if (!website) return null;

  const suggested = [
    `${website.name.toLowerCase().replace(/\s+/g, "")}.com`,
    `${website.name.toLowerCase().replace(/\s+/g, "")}.app`,
    `get${website.name.toLowerCase().replace(/\s+/g, "")}.com`
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Domains and publishing</div>
        <h1 className="mt-4 text-3xl font-semibold">Connect a custom domain</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          This route stores domain assignments in the database. In production, replace this form with a registrar API or DNS verification flow.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold">Suggested domains</div>
          <div className="mt-6 grid gap-4">
            {suggested.map((hostname) => (
              <form key={hostname} action={assignDomain} className="flex items-center justify-between rounded-2xl border p-4">
                <input type="hidden" name="websiteId" value={website.id} />
                <input type="hidden" name="hostname" value={hostname} />
                <div>
                  <div className="font-medium">{hostname}</div>
                  <div className="mt-1 text-sm text-slate-500">Available suggestion</div>
                </div>
                <button className="rounded-xl border px-3 py-2 text-sm">Select</button>
              </form>
            ))}
          </div>

          <form action={assignDomain} className="mt-8 space-y-3">
            <input type="hidden" name="websiteId" value={website.id} />
            <label className="text-sm font-medium">Custom hostname</label>
            <input
              name="hostname"
              defaultValue={website.customDomain?.hostname || ""}
              className="w-full rounded-2xl border px-4 py-3 text-sm"
              placeholder="yourbrand.com"
            />
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">
              Save domain and publish
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold">Connection status</div>
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Website</div>
              <div className="mt-1">{website.name}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Current domain</div>
              <div className="mt-1">{website.customDomain?.hostname || "Pending domain"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">DNS verification</div>
              <div className="mt-1">{website.customDomain?.verified ? "Connected" : "Pending"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">SSL</div>
              <div className="mt-1">{website.customDomain?.sslEnabled ? "Enabled" : "Pending"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
