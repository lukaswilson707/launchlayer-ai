export const dynamic = "force-dynamic";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const workspace = await prisma.workspace.findFirst({
    include: {
      websites: {
        include: {
          analytics: {
            orderBy: { date: "desc" },
            take: 1
          },
          customDomain: true
        }
      }
    }
  });

  const sites = workspace?.websites || [];
  const totalVisits = sites.reduce((sum, site) => sum + (site.analytics[0]?.visits || 0), 0);
  const totalLeads = sites.reduce((sum, site) => sum + (site.analytics[0]?.leads || 0), 0);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Workspace</div>
        <h1 className="mt-4 text-3xl font-semibold">{workspace?.name || "Dashboard"}</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Manage websites, domains, billing, AI generations, and customer growth from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active websites", String(sites.length)],
          ["Total visits", totalVisits.toLocaleString()],
          ["Lead submissions", String(totalLeads)],
          ["Current plan", workspace?.plan || "FREE"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Projects</h2>
            <p className="mt-1 text-sm text-slate-600">Each website has its own prompt, pages, analytics, and domain settings.</p>
          </div>
          <Link href="/app/new" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">
            Create website
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {sites.map((site) => (
            <div key={site.id} className="flex flex-col gap-3 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-semibold">{site.name}</div>
                <div className="mt-1 text-sm text-slate-500">{site.customDomain?.hostname || "Pending domain"}</div>
              </div>
              <div className="text-sm text-slate-600">
                {site.analytics[0]?.visits || 0} visits • {site.analytics[0]?.leads || 0} leads • {site.status}
              </div>
              <div className="flex gap-2">
                <Link href={`/app/builder?websiteId=${site.id}`} className="rounded-xl border px-3 py-2 text-sm">Open</Link>
                <Link href={`/app/domains?websiteId=${site.id}`} className="rounded-xl bg-slate-950 px-3 py-2 text-sm text-white">Domains</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
