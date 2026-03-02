import { providers } from "../data/mockProviders.js";
import { RatingStars } from "./RatingStars.jsx";

const mockJobs = [
  {
    id: 101,
    customerName: "Mrs Ndlovu",
    service: "Plumber",
    location: "Hillside",
    description: "Burst pipe in the backyard. Needs urgent repair.",
    status: "pending"
  },
  {
    id: 102,
    customerName: "TechHub Start-up",
    service: "Electrician",
    location: "CBD",
    description: "Install extra sockets and check wiring in office.",
    status: "accepted"
  }
];

export function ProviderDashboard() {
  const featuredProvider = providers[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">
            Provider dashboard
          </p>
          <h2 className="text-xl font-semibold text-slate-50">
            Welcome back, {featuredProvider.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-slate-300">
            Keep your status up to date and respond quickly to job requests to
            grow your rating and get featured in search.
          </p>
        </div>
        <div className="w-px bg-slate-800 hidden md:block" />
        <div className="flex flex-col gap-2 text-sm">
          <div className="font-medium text-slate-200 flex items-center justify-between gap-4">
            <span>{featuredProvider.service}</span>
            <span className="text-xs text-slate-400">
              {featuredProvider.experienceYears} years experience
            </span>
          </div>
          <RatingStars rating={featuredProvider.rating} />
          <p className="text-xs text-slate-400">
            {featuredProvider.reviews} completed jobs • {featuredProvider.location}
          </p>
          <button className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 text-xs font-semibold px-4 py-1.5">
            Toggle availability
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100">
            Job requests
          </h3>
          <span className="text-xs text-slate-400">
            Demo only – no real bookings
          </span>
        </div>
        <div className="space-y-3">
          {mockJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-slate-100">
                    {job.customerName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {job.location} • {job.service}
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    job.status === "pending"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/40"
                      : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                  }`}
                >
                  {job.status === "pending" ? "New" : "Accepted"}
                </span>
              </div>
              <p className="text-xs text-slate-300">{job.description}</p>
              <div className="flex gap-2 justify-end">
                <button className="px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-200 hover:border-slate-400">
                  Decline
                </button>
                <button className="px-3 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-[11px] text-slate-950 font-semibold">
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

