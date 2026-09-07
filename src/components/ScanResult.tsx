import type { AnalysisResult } from "@/lib/analyze.functions";

const verdictStyles: Record<AnalysisResult["verdict"], { label: string; className: string }> = {
  healthy: { label: "Healthy", className: "bg-success text-success-foreground" },
  moderate: { label: "Eat occasionally", className: "bg-warning text-warning-foreground" },
  unhealthy: { label: "Not healthy", className: "bg-destructive text-destructive-foreground" },
};

const claimStyles: Record<string, string> = {
  true: "bg-success/15 text-success border-success/30",
  misleading: "bg-warning/20 text-warning-foreground border-warning/40",
  false: "bg-destructive/12 text-destructive border-destructive/30",
};

const confidenceStyles: Record<string, string> = {
  high: "bg-success text-success-foreground",
  medium: "bg-warning text-warning-foreground",
  low: "bg-destructive text-destructive-foreground",
};


function Gauge({ value, max, label, caption }: { value: number; max: number; label: string; caption: string }) {
  const pct = Math.max(2, Math.min(100, (value / max) * 100));
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
        <span className="font-display text-3xl font-bold text-foreground">{caption}</span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ScanResult({ result, image }: { result: AnalysisResult; image: string }) {
  const v = verdictStyles[result.verdict] ?? verdictStyles.moderate;

  return (
    <section className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row">
          <img
            src={image}
            alt={`Photo of ${result.productName}`}
            className="h-44 w-full object-cover sm:h-auto sm:w-40"
          />
          <div className="flex-1 space-y-2 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {result.category}
            </p>
            <h2 className="text-2xl font-bold">{result.productName}</h2>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${v.className}`}
            >
              {v.label}
            </span>
            <p className="pt-1 text-sm leading-relaxed text-muted-foreground">{result.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Gauge
          label="P:C ratio"
          value={result.pcRatio}
          max={2}
          caption={result.pcRatio.toFixed(2)}
        />
        <Gauge
          label="Trust score"
          value={result.trustScore}
          max={100}
          caption={`${result.trustScore}`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-bold">What the P:C ratio means here</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{result.pcExplanation}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-bold">How much to trust this pack</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {result.trustExplanation}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold">Confidence in this reading</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${confidenceStyles[result.confidence] ?? confidenceStyles["medium"]}`}
          >
            {result.confidence}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {result.confidenceExplanation}
        </p>
        {result.legibility?.length > 0 && (
          <ul className="mt-3 space-y-2">
            {result.legibility.map((l, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {l}
              </li>
            ))}
          </ul>
        )}
      </div>


      {(result.claims?.length ?? 0) > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-bold">Claim by claim</h3>
          <ul className="mt-3 space-y-3">
            {result.claims.map((c, i) => (
              <li key={i} className="rounded-xl bg-muted/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-sm font-semibold">“{c.claim}”</span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${claimStyles[c.verdict] ?? claimStyles["misleading"]}`}
                  >
                    {c.verdict}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.reality}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { title: "Red flags", items: result.redFlags ?? [], dot: "bg-destructive" },
          { title: "Green flags", items: result.greenFlags ?? [], dot: "bg-success" },
        ].map((group) =>
          group.items.length > 0 ? (
            <div key={group.title} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h3 className="text-sm font-bold">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${group.dot}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null,
        )}
      </div>
    </section>
  );
}
