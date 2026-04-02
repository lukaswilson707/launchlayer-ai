import Link from "next/link";
import { Check } from "lucide-react";
import { appConfig } from "@/lib/config";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium">Pricing</div>
          <h1 className="mt-4 text-4xl font-semibold">Choose the plan that fits your website business</h1>
          <p className="mt-3 text-slate-600">
            These plans are wired for recurring revenue, clear upgrade prompts, and room to expand into teams and agencies.
          </p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-4">
          {appConfig.plans.map((plan) => (
            <div key={plan.key} className="rounded-3xl border border-slate-200 bg-white p-6">
              <div className="text-lg font-semibold">{plan.name}</div>
              <div className="mt-2 text-4xl font-semibold">${plan.priceMonthly}<span className="text-base font-normal text-slate-500">/mo</span></div>
              <div className="mt-5 space-y-3">
                {[
                  `${plan.sites} website slots`,
                  `${plan.domains} custom domains`,
                  `${plan.aiGenerations} AI generations`,
                  "Lead forms and analytics",
                  "Publishing and domain flows"
                ].map((item) => (
                  <div key={item} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/app/billing" className="mt-6 inline-flex rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                Select {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
