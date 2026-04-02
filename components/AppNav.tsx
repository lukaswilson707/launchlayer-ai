import Link from "next/link";
import { BarChart3, CreditCard, Globe, LayoutDashboard, Plus, Sparkles, Wand2 } from "lucide-react";

const links = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/new", label: "New website", icon: Plus },
  { href: "/app/builder", label: "Builder", icon: Wand2 },
  { href: "/app/domains", label: "Domains", icon: Globe },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 }
];

export function AppNav() {
  return (
    <aside className="w-full rounded-3xl border border-slate-200 bg-white p-4 lg:w-72">
      <div className="mb-4 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">LaunchLayer AI</div>
          <div className="text-xs text-slate-500">Workspace</div>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
