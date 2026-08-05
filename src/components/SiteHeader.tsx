import { Link } from "@tanstack/react-router";

const links = [
  { to: "/scan", label: "Scan" },
  { to: "/history", label: "History" },
  { to: "/api", label: "API Program" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          Label<span className="text-primary">Truth</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3 py-1.5 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/scan"
            className="ml-2 hidden rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90 sm:inline-flex"
          >
            Scan a pack
          </Link>
        </div>
      </nav>
    </header>
  );
}
