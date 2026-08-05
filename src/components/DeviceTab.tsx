import { useEffect, useState } from "react";

import annDevice from "@/assets/ann-device.jpg";

const tabs = ["Live readout", "Sync with LabelTruth", "Device specs"] as const;
type Tab = (typeof tabs)[number];

function useLiveTelemetry(active: boolean) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setTick((p) => p + 1), 1800);
    return () => clearInterval(t);
  }, [active]);

  const wave = (offset: number, spread: number, base: number) =>
    Math.round(base + Math.sin((tick + offset) / 2.1) * spread);

  return {
    glucoseTrend: wave(0, 6, 94),
    sodiumLoad: wave(2, 180, 1240),
    proteinToday: wave(4, 4, 46),
    addedSugar: wave(1, 5, 28),
    lastSync: tick,
  };
}

export function DeviceTab() {
  const [tab, setTab] = useState<Tab>("Live readout");
  const live = useLiveTelemetry(tab === "Live readout");

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/50 p-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-background"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_240px]">
        <div>
          {tab === "Live readout" && (
            <div>
              <div className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-success" />
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Streaming from TechForges tracker · demo data
                </p>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { l: "Glucose trend", v: `${live.glucoseTrend} mg/dL`, s: "steady" },
                  { l: "Sodium load today", v: `${live.sodiumLoad} mg`, s: "of 2,000 mg" },
                  { l: "Protein today", v: `${live.proteinToday} g`, s: "of 60 g" },
                  { l: "Added sugar today", v: `${live.addedSugar} g`, s: "of 25 g" },
                ].map((m) => (
                  <div key={m.l} className="rounded-2xl bg-muted/60 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {m.l}
                    </p>
                    <p className="font-display mt-1 text-2xl font-bold">{m.v}</p>
                    <p className="text-xs text-muted-foreground">{m.s}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Refreshed {live.lastSync * 1.8}s into this session. The shipping device will stream
                real sensor data; this tab is the live interface preview.
              </p>
            </div>
          )}

          {tab === "Sync with LabelTruth" && (
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p className="text-foreground">
                <strong className="font-semibold">One scan, two signals.</strong> Every pack you scan
                is pushed to the tracker so intake is logged with its P:C ratio and trust score
                attached.
              </p>
              <ol className="space-y-3">
                {[
                  "Scan the pack in LabelTruth — verdict, P:C ratio, trust score and confidence band are computed.",
                  "The tracker receives the nutrient profile over Bluetooth LE and logs the portion you actually ate.",
                  "If a low-trust pack pushes you past a daily threshold, the device buzzes before the next serving.",
                  "Weekly rollups show how much of your intake came from packs scoring under 1.00 P:C.",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-display grid size-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {tab === "Device specs" && (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              {[
                ["Maker", "TechForges"],
                ["Status", "Upcoming — first API client"],
                ["Form factor", "Titanium-coated ring, 4.1g"],
                ["Sensors", "Optical glucose trend, skin temp, motion"],
                ["Battery", "6 days typical, 40 min charge"],
                ["Link", "Bluetooth LE 5.4, LabelTruth API v1"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-muted/60 p-4">
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-1 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <img
          src={annDevice}
          alt="TechForges nutrition tracking device"
          loading="lazy"
          width={1024}
          height={640}
          className="h-40 w-full rounded-2xl object-cover md:h-full"
        />
      </div>
    </div>
  );
}
