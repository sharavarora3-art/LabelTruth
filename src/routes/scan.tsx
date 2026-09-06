import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useRef, useState } from "react";

import { ScanResult } from "@/components/ScanResult";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { analyzeLabel, type AnalysisResult } from "@/lib/analyze.functions";
import { saveScan } from "@/lib/scan-history";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a food label — LabelTruth P:C scanner" },
      {
        name: "description",
        content:
          "Photograph a packaged food label and get an instant healthy-or-not verdict, the Product-to-Claim ratio, a trust score and a confidence explanation.",
      },
      { property: "og:title", content: "Scan a food label — LabelTruth P:C scanner" },
      {
        property: "og:description",
        content:
          "Snap the front of pack plus the nutrition panel and LabelTruth audits every claim on it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scan,
});

const MAX_EDGE = 1568;

async function fileToCompressedDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that photo.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.92);
}

function Scan() {
  const analyze = useServerFn(analyzeLabel);
  const cameraRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const list = Array.from(files).slice(0, 3);
      const dataUrls = await Promise.all(list.map(fileToCompressedDataUrl));
      setImages(dataUrls);
      const res = await analyze({ data: { images: dataUrls } });
      setResult(res);
      saveScan({ image: dataUrls[0]!, result: res });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while scanning.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="main-content" className="pb-20">
        <section
          className="px-5 pb-14 pt-12 text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Scan a packaged food</h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/75">
              For the most accurate reading, add up to three photos of the same product: the front of
              pack, the ingredient list and the nutrition panel. More readable text means a higher
              confidence band.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                aria-describedby="scan-help"
                onClick={() => cameraRef.current?.click()}
                disabled={loading}
                className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Reading label…" : "Take a photo"}
              </button>
              <button
                type="button"
                aria-describedby="scan-help"
                onClick={() => uploadRef.current?.click()}
                disabled={loading}
                className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10 disabled:opacity-60"
              >
                Upload up to 3 images
              </button>
            </div>
            <p id="scan-help" className="mt-3 text-xs text-primary-foreground/65">
              Images stay in this session and are used only to create your label reading.
            </p>
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </section>

        <div className="mx-auto -mt-8 max-w-3xl px-5">
          {error && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-sm font-medium text-destructive shadow-card">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center gap-3" role="status" aria-live="polite">
                <span className="size-3 animate-pulse rounded-full bg-accent" />
                <p className="text-sm font-semibold">
                  Reading ingredients, claims and the nutrition panel…
                </p>
              </div>
              <div className="mt-5 space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-3 animate-pulse rounded-full bg-muted" />
                ))}
              </div>
            </div>
          )}

          {!loading && result && images[0] && <ScanResult result={result} image={images[0]} />}

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
                Every result also carries a confidence band explaining how much of the label was
                actually legible. This is guidance, not medical advice.
              </p>
            </div>
          )}
        </div>
      </main>
       <SiteFooter />
    </div>
  );
}
