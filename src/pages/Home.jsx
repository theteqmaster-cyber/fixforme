import { providers } from "../data/mockProviders.js";
import { ServiceCard } from "../components/ServiceCard.jsx";

export function Home({ onNavChange, onSelectProvider }) {
  const topProviders = providers.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-400">
            Bulawayo • Local services
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            Find trusted{" "}
            <span className="text-emerald-400">plumbers, electricians</span> and
            more — in minutes.
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-xl">
            FixBulawayo connects residents with verified local youth and
            skilled artisans. Search, compare ratings, and send a hire request
            without WhatsApp chaos.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavChange("search")}
              className="inline-flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/40"
            >
              Find a provider
            </button>
            <button
              onClick={() => onNavChange("dashboard")}
              className="inline-flex items-center justify-center rounded-full border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:border-slate-400"
            >
              I&apos;m a service provider
            </button>
          </div>
          <div className="flex flex-wrap gap-4 items-center text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              ✅ Ratings & reviews
            </span>
            <span className="inline-flex items-center gap-1">
              ✅ Focused on Bulawayo
            </span>
            <span className="inline-flex items-center gap-1">
              ✅ Youth empowerment
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3 shadow-xl shadow-black/50">
            <p className="text-xs font-medium text-slate-300 mb-2">
              Trending services this week
            </p>
            <div className="grid gap-2 text-xs text-slate-200">
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2">
                <span>Plumbing emergencies</span>
                <span className="text-emerald-400 font-semibold">+18 jobs</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2">
                <span>Small electrical fixes</span>
                <span className="text-emerald-400 font-semibold">+9 jobs</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2">
                <span>Carpentry & furniture</span>
                <span className="text-emerald-400 font-semibold">+6 jobs</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="font-semibold text-slate-100 mb-1">Youth powered</p>
              <p>
                Give trained local youth a real shot at meaningful work.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="font-semibold text-slate-100 mb-1">
                Community trust
              </p>
              <p>Ratings and reviews help you choose safely.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
              <p className="font-semibold text-slate-100 mb-1">
                Built for Bulawayo
              </p>
              <p>Start local, then scale to the rest of Zimbabwe.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Top rated this week
          </h2>
          <button
            onClick={() => onNavChange("search")}
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            View all
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {topProviders.map((p) => (
            <ServiceCard
              key={p.id}
              provider={p}
              onHireClick={onSelectProvider}
              onViewProfile={onSelectProvider}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

