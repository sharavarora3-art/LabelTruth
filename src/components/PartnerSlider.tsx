import { partners } from "@/lib/site-data";

function LogoPill({ name, note }: { name: string; note: string }) {
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-3 flex w-64 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-card">
      <span className="font-display grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
        {initials}
      </span>
      <span className="min-w-0">
        <span className="font-display block truncate text-sm font-bold">{name}</span>
        <span className="block truncate text-xs text-muted-foreground">{note}</span>
      </span>
    </div>
  );
}

export function PartnerSlider() {
  return (
    <div className="marquee-mask relative overflow-hidden py-2">
      <div className="animate-marquee flex w-max">
        {[...partners, ...partners].map((p, i) => (
          <LogoPill key={`${p.name}-${i}`} name={p.name} note={p.note} />
        ))}
      </div>
    </div>
  );
}
