import Link from "next/link";
import { AppNav } from "@/components/AppNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 p-4 lg:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" className="text-sm text-slate-500">← Back to marketing site</Link>
          <div className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">Demo session</div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <AppNav />
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}
