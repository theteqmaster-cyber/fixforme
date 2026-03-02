import { useMemo, useState } from "react";
import { providers } from "../data/mockProviders.js";
import { ServiceCard } from "../components/ServiceCard.jsx";

export function SearchResults({ onSelectProvider }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = p.rating >= minRating;
      return matchesSearch && matchesRating;
    });
  }, [searchTerm, minRating]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Search providers
            </h2>
            <p className="text-xs text-slate-400">
              Type a service (e.g. plumber), name, or suburb.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Try “plumber”, “electrician”, or “Nkulumane”…"
            className="flex-1 rounded-full bg-slate-950/70 border border-slate-700 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="whitespace-nowrap">Min rating</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="rounded-full bg-slate-950/80 border border-slate-700 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value={0}>Any</option>
              <option value={3}>3.0+</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs text-slate-400">
          Showing {filtered.length} of {providers.length} providers
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6 text-center text-sm text-slate-300">
            No matches yet. Try a different service or remove some filters.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {filtered.map((p) => (
              <ServiceCard
                key={p.id}
                provider={p}
                onHireClick={onSelectProvider}
                onViewProfile={onSelectProvider}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

