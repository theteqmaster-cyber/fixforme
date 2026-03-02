export function Navbar({ onNavChange, current }) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "search", label: "Find Talent" },
    { id: "dashboard", label: "Provider Dashboard" },
    { id: "auth", label: "Login / Register" }
  ];

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => onNavChange("home")}
        >
          <div className="h-8 w-8 rounded-xl bg-brand-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/40">
            FB
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-slate-50">
              FixBulawayo
            </div>
            <div className="text-[11px] text-slate-400">
              Local skills • Real impact
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={`px-3 py-1.5 rounded-full font-medium transition ${
                current === item.id
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-300 hover:bg-slate-800/80"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

