import { RatingStars } from "../components/RatingStars.jsx";

export function Profile({ provider, onBack }) {
  if (!provider) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          No provider selected. Go back to{" "}
          <button
            className="text-emerald-400 hover:text-emerald-300 underline"
            onClick={onBack}
          >
            search
          </button>{" "}
          to choose someone.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <button
        onClick={onBack}
        className="text-xs text-slate-400 hover:text-slate-200"
      >
        ← Back to results
      </button>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 flex flex-col md:flex-row gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-700 flex items-center justify-center text-3xl font-bold text-slate-950 shadow-lg shadow-emerald-500/40">
          {provider.name
            .split(" ")
            .map((x) => x[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-50">
                {provider.name}
              </h1>
              <p className="text-sm text-brand-400 font-medium">
                {provider.service}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                provider.available
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-700/60 text-slate-300 border border-slate-600"
              }`}
            >
              {provider.available ? "Available today" : "Currently booked"}
            </span>
          </div>

          <RatingStars rating={provider.rating} />
          <p className="text-xs text-slate-400">
            {provider.reviews} reviews • {provider.location} •{" "}
            {provider.experienceYears}+ years experience
          </p>
          <p className="text-sm text-slate-200 mt-2">{provider.bio}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.2fr),minmax(0,0.9fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-100">Hire request</h2>
          <p className="text-xs text-slate-400">
            This is a demo form. In production, this would send a request via
            backend/WhatsApp/SMS.
          </p>
          <div className="space-y-3 text-xs">
            <input
              placeholder="Your name"
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <input
              placeholder="Your address / suburb"
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <textarea
              rows={3}
              placeholder="What needs fixing? (e.g. burst pipe in bathroom, no power in bedroom…)"
              className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
            <button className="mt-1 inline-flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40">
              Send demo request
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3 text-xs text-slate-300">
          <h2 className="text-sm font-semibold text-slate-100">
            Contact & location
          </h2>
          <p>
            <span className="text-slate-400">Phone:</span>{" "}
            <span className="font-medium text-slate-100">
              {provider.phone}
            </span>
          </p>
          <p>
            <span className="text-slate-400">Based in:</span>{" "}
            <span className="font-medium text-slate-100">
              {provider.location}, Bulawayo
            </span>
          </p>
          <p className="text-slate-400 pt-2">
            For the live version, this sidebar could show a map pin, WhatsApp
            quick actions, and average response time based on real data.
          </p>
        </div>
      </section>
    </div>
  );
}

