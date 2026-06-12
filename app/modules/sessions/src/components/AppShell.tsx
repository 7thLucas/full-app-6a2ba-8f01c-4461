import { Link, useLocation } from "react-router";
import { useConfigurables } from "~/modules/configurables";
import { cn } from "~/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Dashboard" },
  { to: "/sessions", label: "Sessions" },
  { to: "/sessions/new", label: "New Session" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { config } = useConfigurables();
  const location = useLocation();

  const primary = config?.brandColor?.primary ?? "#1E3A5F";
  const accent = config?.brandColor?.accent ?? "#10B981";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Header */}
      <header
        className="border-b border-gray-800 px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: primary }}
      >
        <Link to="/" className="flex items-center gap-3">
          {config?.logoUrl && !config.logoUrl.includes("FILL_") ? (
            <img src={config.logoUrl} alt={config?.appName ?? "interviewqqq"} className="h-8 object-contain" />
          ) : (
            <span className="text-xl font-bold tracking-tight text-white">
              {config?.appName ?? "interviewqqq"}
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "px-4 py-2 rounded text-sm font-medium transition-colors",
                location.pathname === link.to
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-3 text-center text-xs text-gray-600">
        {config?.appName ?? "interviewqqq"} — interview intelligence
      </footer>
    </div>
  );
}
