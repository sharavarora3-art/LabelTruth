import { Link } from "@tanstack/react-router";

const links = [
  { to: "/scan", label: "Scan" },
  { to: "/history", label: "History" },
  { to: "/api", label: "API Program" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"
      >
        <Link
          to="/"
          aria-label="LabelTruth home"
          className="shrink-0 font-display text-2xl font-semibold leading-none"
        >
          Label<span className="italic text-primary">Truth</span>
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold uppercase tracking-[0.12em]">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="shrink-0 px-3 py-2 text-muted-foreground transition hover:text-foreground"
              activeProps={{
                className: "shrink-0 bg-secondary px-3 py-2 text-secondary-foreground transition",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/scan"
            className="ml-3 hidden border border-primary bg-primary px-5 py-2.5 text-[11px] font-bold text-primary-foreground transition hover:bg-primary/90 sm:inline-flex"
          >
            Scan a pack
          </Link>
        </div>
      </nav>
    </header>
  );
}
