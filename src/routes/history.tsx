import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ScanResult } from "@/components/ScanResult";
import { clearHistory, loadHistory, type ScanRecord } from "@/lib/scan-history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Your scan history — LabelTruth" },
      {
        name: "description",
        content:
          "Every pack you have scanned with LabelTruth, with its P:C ratio, trust score, verdict and confidence band, stored privately on your own device.",
      },
      { property: "og:title", content: "Your scan history — LabelTruth" },
      {
        property: "og:description",
        content: "Review past label audits and compare P:C ratios and trust scores over time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: History,
});

function History() {
  const [records, setRecords] = useState<ScanRecord[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(loadHistory());
  }, []);

  const open = records.find((r) => r.id === openId) ?? null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Scan history
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Everything you&apos;ve scanned</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              History is stored only on this device — LabelTruth never uploads your scan log.
            </p>
          </div>
          {records.length > 0 && (
            <button
              onClick={() => {
                setRecords(clearHistory());
                setOpenId(null);
              }}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted"
            >
              Clear history
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <p className="text-sm text-muted-foreground">No scans yet.</p>
            <Link
              to="/scan"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              Scan your first pack
            </Link>
          </div>
        ) : (
          <ul className="mt-10 space-y-3">
            {records.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => setOpenId(openId === r.id ? null : r.id)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-card transition hover:border-primary/40"
                >
                  <img
                    src={r.image}
                    alt={r.result.productName}
                    className="size-16 shrink-0 rounded-xl object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{r.result.productName}</span>
                    <span className="block text-xs text-muted-foreground">
                      {new Date(r.scannedAt).toLocaleString()} · {r.result.category}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="font-display block text-lg font-bold text-primary">
                      {r.result.pcRatio.toFixed(2)}
                    </span>
                    <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
                      P:C · trust {r.result.trustScore}
                    </span>
                  </span>
                </button>
                {open?.id === r.id && (
                  <div className="mt-3">
                    <ScanResult result={open.result} image={open.image} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
