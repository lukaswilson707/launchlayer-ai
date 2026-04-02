export const dynamic = "force-dynamic";
import Link from "next/link";
import { Sparkles, Wand2, Globe, CreditCard, BarChart3, Users, ArrowRight, Check } from "lucide-react";
import { appConfig } from "@/lib/config";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const demoWorkspace = await prisma.workspace.findFirst({
    include: {
      websites: {
        include: { analytics: true }
      }
    }
  });

  const features = [
    { icon: Wand2, title: "AI site generation", text: "Generate pages, copy, sections, and themes from a single prompt." },
    { icon: Sparkles, title: "Chat based editing", text: "Edit layout, copy, pricing, or sections through natural language." },
    { icon: Globe, title: "Custom domains", text: "Connect or buy domains and publish with SSL support." },
    { icon: CreditCard, title: "Tiered monetization", text: "Free, starter, pro, and business plans with upgrade paths." },
    { icon: BarChart3, title: "Analytics and leads", text: "Track traffic, conversions, and captured leads from one dashboard." },
    { icon: Users, title: "Agency mode", text: "Manage multiple clients and workspaces as the business scales." }
  ];

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold">{appConfig.appName}</div>
              <div className="text-xs text-slate-500">AI website builder SaaS</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href="/app" className="rounded-2xl border px-4 py-2 text-sm">Dashboard</Link>
            <Link href="/app/new" className="rounded-2xl bg-slate-950 px-4 py-2 text-sm text-white">Start free</Link>
          </div>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
              Fully coded MVP starter
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight">
              Build websites with AI, sell subscriptions, and launch on custom domains
            </h1>
            <p className="max-w-2xl text-lg text-slate-600">
              This repo gives you a real Next.js starting point for the product, including database models, AI generation routes, billing hooks, domain management flows, and a basic website renderer.
            </p>
            <div className="flex gap-3">
              <Link href="/app" className="inline-flex items-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white">
                Open app
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center rounded-2xl border px-5 py-3 text-sm font-medium">
                View pricing
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <div className="text-sm font-medium text-slate-500">Demo workspace</div>
            <div className="mt-3 text-2xl font-semibold">{demoWorkspace?.name || "Demo Workspace"}</div>
            <div className="mt-2 text-sm text-slate-600">
              {demoWorkspace?.websites?.length || 0} websites • {(demoWorkspace?.plan || "FREE").toString()} plan
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {(demoWorkspace?.websites || []).map((site) => (
                <div key={site.id} className="rounded-2xl border bg-white p-4">
                  <div className="font-medium">{site.name}</div>
                  <div className="mt-1 text-sm text-slate-500">{site.status}</div>
                  <div className="mt-3 text-sm text-slate-600">
                    {site.analytics[0]?.visits || 0} visits • {site.analytics[0]?.leads || 0} leads
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Core features</div>
          <h2 className="mt-4 text-3xl font-semibold">Everything needed to make the business work</h2>
          <p className="mt-3 text-slate-600">
            The product is more than a page builder. It needs AI, billing, domains, analytics, publishing, and retention features that support recurring revenue.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-3xl border border-slate-200 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium">Pricing</div>
            <h2 className="mt-4 text-3xl font-semibold">Subscription tiers built to monetize</h2>
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
                    "Lead forms and analytics"
                  ].map((item) => (
                    <div key={item} className="flex gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/pricing" className="mt-6 inline-flex rounded-2xl border px-4 py-2 text-sm font-medium">
                  Choose {plan.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
