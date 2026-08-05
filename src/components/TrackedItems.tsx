import { useRef, useState } from "react";

import { trackedItems, type TrackedItem } from "@/lib/site-data";

const verdictClass: Record<TrackedItem["verdict"], string> = {
  healthy: "bg-success text-success-foreground",
  moderate: "bg-warning text-warning-foreground",
  unhealthy: "bg-destructive text-destructive-foreground",
};

function TiltCard({ item }: { item: TrackedItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0, active: false });

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setT({ x: -py * 22, y: px * 26, active: true });
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={() => setT({ x: 0, y: 0, active: false })}
        className="grid h-44 cursor-grab place-items-center rounded-2xl bg-muted/60"
        style={{ perspective: "800px" }}
      >
        <img
          src={item.image}
          alt={`${item.company} ${item.item}`}
          loading="lazy"
          width={768}
          height={768}
          className="max-h-36 w-auto select-none"
          style={{
            transform: `rotateX(${t.x}deg) rotateY(${t.y}deg) scale(${t.active ? 1.08 : 1})`,
            transition: t.active ? "transform 80ms linear" : "transform 500ms ease-out",
            filter: "drop-shadow(0 16px 22px rgb(0 0 0 / 0.22))",
          }}
          draggable={false}
        />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {item.company}
      </p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <h3 className="text-base font-bold">{item.item}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${verdictClass[item.verdict]}`}
        >
          {item.verdict}
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.note}</p>
      <div className="mt-4 flex gap-6 border-t border-border pt-3">
        <span className="text-sm">
          <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
            P:C
          </span>
          <span className="font-display text-lg font-bold text-primary">
            {item.pc.toFixed(2)}
          </span>
        </span>
        <span className="text-sm">
          <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
            Trust
          </span>
          <span className="font-display text-lg font-bold">{item.trust}</span>
        </span>
      </div>
    </div>
  );
}

export function TrackedItems() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {trackedItems.map((item) => (
        <TiltCard key={`${item.company}-${item.item}`} item={item} />
      ))}
    </div>
  );
}
