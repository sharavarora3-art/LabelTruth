import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";

import { ScanResult } from "@/components/ScanResult";
import { analyzeLabel, type AnalysisResult } from "@/lib/analyze.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LabelTruth — Scan packaged food, get a trust score" },
      {
        name: "description",
        content:
          "Photograph any packaged food label and get an instant healthy-or-not verdict, a Product-to-Claim (P:C) ratio and a trust score for the pack's claims.",
      },
      { property: "og:title", content: "LabelTruth — Scan packaged food, get a trust score" },
      {
        property: "og:description",
        content:
          "Snap a food label and see whether the pack lives up to its claims, scored with the P:C ratio and a 0-100 trust score.",
      },
    ],
  }),
  component: Index,
});

const MAX_EDGE = 1100;

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that photo.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.82);
}

function Index() {
  const analyze = useServerFn(analyzeLabel);
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setImage(dataUrl);
      const res = await analyze({ data: { imageDataUrl: dataUrl } });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while scanning.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header
        className="px-5 pb-14 pt-12 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            P:C ratio scanner
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl">
            Photograph the pack.
            <br />
            See if it's telling the truth.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
            LabelTruth reads the label, judges healthy or not, and scores the gap between what the
            product actually delivers and what the packaging claims — the{" "}
            <strong className="font-semibold text-accent">Product-to-Claim (P:C) ratio</strong> —
            plus a 0-100 trust score.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => cameraRef.current?.click()}
              disabled={loading}
              className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Reading label…" : "Take a photo"}
            </button>
            <button
              onClick={() => uploadRef.current?.click()}
              disabled={loading}
              className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10 disabled:opacity-60"
            >
              Upload an image
            </button>
          </div>

          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={uploadRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </header>

      <div className="mx-auto -mt-8 max-w-3xl px-5">
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm font-medium text-destructive shadow-card">
            {error}
          </div>
        )}

        {loading && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3">
              <span className="size-3 animate-pulse rounded-full bg-accent" />
              <p className="text-sm font-semibold">
                Reading ingredients, claims and nutrition panel…
              </p>
            </div>
            <div className="mt-5 space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-3 animate-pulse rounded-full bg-muted" />
              ))}
            </div>
          </div>
        )}

        {!loading && result && image && <ScanResult result={result} image={image} />}

        {!loading && !result && !error && (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-bold">How the P:C ratio works</h2>
            <ul className="mt-4 space-y-4">
              {[
                {
                  n: "1.00",
                  t: "Honest pack",
                  d: "The ingredients and nutrition fully back up every claim on the front.",
                },
                {
                  n: "< 1.00",
                  t: "Over-promising",
                  d: "\"High protein\", \"no added sugar\" or \"natural\" outrun what's really inside.",
                },
                {
                  n: "> 1.00",
                  t: "Quietly good",
                  d: "The product is more nutritious than its own marketing suggests.",
                },
              ].map((row) => (
                <li key={row.n} className="flex gap-4">
                  <span className="font-display w-16 shrink-0 text-lg font-bold text-primary">
                    {row.n}
                  </span>
                  <span className="text-sm">
                    <strong className="font-semibold">{row.t}</strong>
                    <span className="block text-muted-foreground">{row.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              For best results, capture the front of the pack with the ingredients or nutrition
              panel visible. This is guidance, not medical advice.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
