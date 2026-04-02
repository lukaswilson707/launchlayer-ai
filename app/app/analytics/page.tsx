export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  const websites = await prisma.website.findMany({
    include: {
      analytics: {
        orderBy: { date: "desc" },
        take: 7
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Analytics</div>
        <h1 className="mt-4 text-3xl font-semibold">Performance overview</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          This page shows the basic data shape for reporting visits, leads, and conversion rates per website.
        </p>
      </div>

      <div className="space-y-4">
        {websites.map((website) => {
          const latest = website.analytics[0];
          return (
            <div key={website.id} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="text-xl font-semibold">{website.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{website.niche || "General business"}</div>
                </div>
                <div className="text-sm text-slate-600">
                  {latest?.visits || 0} visits • {latest?.leads || 0} leads • {latest?.conversions || 0}% conversion
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
