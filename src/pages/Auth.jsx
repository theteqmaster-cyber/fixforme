export function Auth() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Login (demo only)
        </h2>
        <p className="text-xs text-slate-400">
          In the real app, this would connect to a Node.js/Express backend with
          JWT-based authentication.
        </p>
        <div className="space-y-3 text-xs">
          <input
            placeholder="Email or phone"
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button className="mt-1 inline-flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/40">
            Login
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-100">
          Register as provider
        </h2>
        <p className="text-xs text-slate-400">
          Simple onboarding for youth and informal workers to list their
          services.
        </p>
        <div className="space-y-3 text-xs">
          <input
            placeholder="Full name"
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            placeholder="Main service (e.g. plumber)"
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            placeholder="Location / suburb"
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            placeholder="Phone / WhatsApp"
            className="w-full rounded-xl bg-slate-950/70 border border-slate-700 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button className="mt-1 inline-flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-950">
            Create demo profile
          </button>
        </div>
      </section>
    </div>
  );
}

