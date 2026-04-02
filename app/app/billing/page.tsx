import { prisma } from "@/lib/prisma";
import { appConfig } from "@/lib/config";
import { getStripeClient } from "@/lib/stripe";

export default async function BillingPage() {
  const workspace = await prisma.workspace.findFirst({
    include: {
      subscription: true
    }
  });

  const stripeConfigured = Boolean(getStripeClient());

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Billing</div>
        <h1 className="mt-4 text-3xl font-semibold">Subscription system</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          This page reads the workspace plan from the database and shows where Stripe checkout and customer portal links plug in.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="grid gap-6 xl:grid-cols-2">
          {appConfig.plans.map((plan) => {
            const active = workspace?.plan === plan.key;
            return (
              <div key={plan.key} className={`rounded-3xl border bg-white p-6 ${active ? "border-slate-950" : "border-slate-200"}`}>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold">{plan.name}</div>
                  {active ? <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Current</div> : null}
                </div>
                <div className="mt-2 text-4xl font-semibold">${plan.priceMonthly}<span className="text-base font-normal text-slate-500">/mo</span></div>
                <div className="mt-5 space-y-3 text-sm">
                  <div>{plan.sites} website slots</div>
                  <div>{plan.domains} custom domains</div>
                  <div>{plan.aiGenerations} AI generations</div>
                </div>
                <button className="mt-6 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                  {stripeConfigured ? "Open Stripe checkout" : "Add Stripe keys to enable checkout"}
                </button>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-lg font-semibold">Billing summary</div>
          <div className="mt-4 space-y-4 text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Current plan</div>
              <div className="mt-1">{workspace?.plan || "FREE"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Subscription status</div>
              <div className="mt-1">{workspace?.subscription?.status || "not connected"}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-xs text-slate-500">Stripe</div>
              <div className="mt-1">{stripeConfigured ? "Configured" : "Missing API key"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
