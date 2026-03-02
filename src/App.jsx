import { useMemo, useState } from "react";
import { providers } from "./data/mockProviders.js";
import { Navbar } from "./components/Navbar.jsx";
import { Home } from "./pages/Home.jsx";
import { SearchResults } from "./pages/SearchResults.jsx";
import { Profile } from "./pages/Profile.jsx";
import { ProviderDashboard } from "./components/ProviderDashboard.jsx";
import { Auth } from "./pages/Auth.jsx";

type Page = "home" | "search" | "profile" | "dashboard" | "auth";

function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedProvider = useMemo(
    () => providers.find((p) => p.id === selectedId) ?? null,
    [selectedId]
  );

  const handleSelectProvider = (provider: { id: number }) => {
    setSelectedId(provider.id);
    setPage("profile");
  };

  const renderPage = () => {
    switch (page) {
      case "home":
        return (
          <Home
            onNavChange={setPage}
            onSelectProvider={handleSelectProvider}
          />
        );
      case "search":
        return <SearchResults onSelectProvider={handleSelectProvider} />;
      case "profile":
        return (
          <Profile
            provider={selectedProvider}
            onBack={() => setPage("search")}
          />
        );
      case "dashboard":
        return <ProviderDashboard />;
      case "auth":
        return <Auth />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar current={page} onNavChange={setPage} />
      <main className="flex-1 pb-10">{renderPage()}</main>
      <footer className="border-t border-slate-900/80 bg-slate-950/90">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col md:flex-row gap-2 items-center justify-between text-[11px] text-slate-500">
          <span>
            FixBulawayo demo • Built with React, Vite & Tailwind.
          </span>
          <span>
            Phase 1: Frontend prototype. Backend & payments coming later.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;

