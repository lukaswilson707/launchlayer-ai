type RenderableSection =
  | { type: "hero"; headline: string; subheadline: string; ctaPrimary: string; ctaSecondary: string }
  | { type: "features"; items: string[] }
  | { type: "testimonials"; items: Array<{ quote: string; name: string }> }
  | { type: "faq"; items: Array<{ question: string; answer: string }> }
  | { type: "leadForm"; headline: string };

export function WebsiteRenderer({ title, sections }: { title: string; sections: RenderableSection[] }) {
  return (
    <div className="rounded-[28px] border border-slate-300 bg-white shadow-xl">
      <div className="border-b px-8 py-5">
        <div className="text-lg font-semibold">{title}</div>
        <div className="mt-1 text-sm text-slate-500">Rendered from stored page JSON</div>
      </div>

      <div className="space-y-10 px-8 py-8">
        {sections.map((section, index) => {
          if (section.type === "hero") {
            return (
              <section key={index} className="grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="space-y-4">
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">Built with LaunchLayer AI</div>
                  <h1 className="text-4xl font-semibold tracking-tight">{section.headline}</h1>
                  <p className="max-w-xl text-sm leading-7 text-slate-600">{section.subheadline}</p>
                  <div className="flex gap-3">
                    <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white">{section.ctaPrimary}</button>
                    <button className="rounded-2xl border px-4 py-2 text-sm font-medium">{section.ctaSecondary}</button>
                  </div>
                </div>
                <div className="rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 p-8 text-white shadow-lg">
                  <div className="text-sm text-slate-300">Offer stack</div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {["Custom training", "Nutrition plan", "Weekly check ins", "Client dashboard"].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">{item}</div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          if (section.type === "features") {
            return (
              <section key={index} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {section.items.map((item) => (
                  <div key={item} className="rounded-3xl border p-5">
                    <div className="text-base font-semibold">{item}</div>
                    <p className="mt-2 text-sm text-slate-600">This section is editable through AI chat or the visual builder.</p>
                  </div>
                ))}
              </section>
            );
          }

          if (section.type === "testimonials") {
            return (
              <section key={index} className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <div key={item.name} className="rounded-3xl border bg-slate-50 p-6">
                    <p className="text-sm leading-7 text-slate-700">“{item.quote}”</p>
                    <div className="mt-4 text-sm font-medium">{item.name}</div>
                  </div>
                ))}
              </section>
            );
          }

          if (section.type === "faq") {
            return (
              <section key={index} className="rounded-[28px] border bg-slate-50 p-8">
                <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
                <div className="mt-6 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.question} className="rounded-2xl border bg-white p-4">
                      <div className="font-medium">{item.question}</div>
                      <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section.type === "leadForm") {
            return (
              <section key={index} className="rounded-[28px] border bg-slate-50 p-8">
                <div className="max-w-2xl">
                  <div className="text-sm font-medium text-slate-500">Lead capture</div>
                  <h3 className="mt-2 text-2xl font-semibold">{section.headline}</h3>
                  <p className="mt-2 text-sm text-slate-600">Capture leads and push them into your CRM or automation workflows.</p>
                </div>
                <form className="mt-6 grid gap-3 md:grid-cols-3">
                  <input className="rounded-2xl border bg-white px-4 py-3 text-sm" placeholder="Name" />
                  <input className="rounded-2xl border bg-white px-4 py-3 text-sm" placeholder="Email" />
                  <button className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-medium text-white">Submit</button>
                </form>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
