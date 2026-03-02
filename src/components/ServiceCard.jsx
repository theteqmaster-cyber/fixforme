import { RatingStars } from "./RatingStars.jsx";

export function ServiceCard({ provider, onHireClick, onViewProfile }) {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/40 p-4 flex flex-col gap-3 hover:border-brand-500 hover:-translate-y-0.5 transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">
            {provider.name}
          </h3>
          <p className="text-sm text-brand-400 font-medium">
            {provider.service}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            provider.available
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
              : "bg-slate-700/60 text-slate-300 border border-slate-600"
          }`}
        >
          {provider.available ? "Available" : "Booked"}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-300">
        <RatingStars rating={provider.rating} />
        <span className="text-xs text-slate-400">
          {provider.reviews} reviews • {provider.location}
        </span>
      </div>

      <p className="text-sm text-slate-300 line-clamp-2">{provider.bio}</p>

      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onHireClick?.(provider)}
          className="flex-1 inline-flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 text-sm font-semibold py-2 transition shadow-sm shadow-emerald-500/30"
        >
          Hire
        </button>
        <button
          onClick={() => onViewProfile?.(provider)}
          className="px-4 inline-flex items-center justify-center rounded-full border border-slate-600 hover:border-slate-400 text-sm text-slate-200 bg-slate-900/40"
        >
          Profile
        </button>
      </div>
    </div>
  );
}

