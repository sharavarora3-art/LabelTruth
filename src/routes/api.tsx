import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/api")({
  head: () => ({
    meta: [
      { title: "LabelTruth API Program — score labels, earn from ad integration" },
      {
        name: "description",
        content:
          "Integrate the LabelTruth API with your own partner code, score packaged food labels at scale, and earn a share of sponsored placements. Paid plans required.",
      },
      {
        property: "og:title",
        content: "LabelTruth API Program — score labels, earn from ad integration",
      },
      {
        property: "og:description",
        content:
          "Paid API access to the P:C ratio, trust score and confidence bands, plus revenue share on ad integration through your partner code.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApiProgram,
});

const plans = [
  {
    name: "Starter",
    price: "$49 / mo",
    calls: "2,000 label scans",
    share: "40% ad revenue share",
    items: ["1 partner code", "P:C ratio + trust score", "Email support"],
  },
  {
    name: "Growth",
    price: "$249 / mo",
    calls: "20,000 label scans",
    share: "55% ad revenue share",
    items: ["5 partner codes", "Confidence bands + claim breakdown", "Webhook delivery"],
  },
  {
    name: "Device / Enterprise",
    price: "From $1,900 / mo",
    calls: "Custom volume",
    share: "Negotiated revenue share",
    items: [
      "Hardware SDK (as used by TechForges)",
      "Batch + real-time endpoints",
      "Dedicated integration engineer",
    ],
  },
];

function ApiProgram() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section
          className="px-5 pb-16 pt-14 text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="mx-auto max-w-5xl">
            <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              API Program
            </span>
            <h1 className="mt-5 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
              Put LabelTruth scoring inside your product — and earn from it.
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-primary-foreground/75">
              Send a label image, get back a verdict, the P:C ratio, a trust score, a claim-by-claim
              breakdown and a confidence band. Every integration gets a partner code; when you
              display our sponsored placements against a scan, you earn a share of that revenue.
              API access itself is paid — the revenue share offsets it, it does not replace it.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="text-2xl font-bold">How earning works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                n: "01",
                t: "Subscribe to a plan",
                d: "Paid subscription is mandatory. Your plan sets your monthly scan quota and your revenue-share tier.",
              },
              {
                n: "02",
                t: "Integrate with your partner code",
                d: "Pass your partner code on every request so scans, placements and payouts are attributed to you.",
              },
              {
                n: "03",
                t: "Show placements, get paid",
                d: "Render the returned sponsored placement next to the score. Payouts settle monthly against your invoice.",
              },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <p className="font-display text-2xl font-bold text-primary">{s.n}</p>
                <h3 className="mt-2 text-base font-bold">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-14 text-2xl font-bold">Plans</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className="rounded-3xl border border-border bg-card p-6 shadow-card">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {p.name}
                </p>
                <p className="font-display mt-3 text-2xl font-bold">{p.price}</p>
                <p className="mt-1 text-sm text-muted-foreground">{p.calls}</p>
                <p className="mt-3 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  {p.share}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.items.map((i) => (
                    <li key={i} className="flex gap-2.5">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="mt-14 text-2xl font-bold">Request shape</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            One endpoint, one image, one partner code. Sandbox keys are issued on subscription.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-foreground p-5 text-xs leading-relaxed text-background">
{`POST https://api.labeltruth.app/v1/audit
Authorization: Bearer <your_api_key>
Content-Type: application/json

{
  "partner_code": "LT-TECHFORGES-001",
  "image": "data:image/jpeg;base64,...",
  "ad_slot": true
}

200 OK
{
  "product_name": "Cocoa Protein Bar",
  "verdict": "moderate",
  "pc_ratio": 0.86,
  "trust_score": 62,
  "confidence": { "band": "high", "explanation": "Full panel legible." },
  "claims": [{ "claim": "20g protein", "verdict": "true" }],
  "placement": { "id": "plc_92f", "payout_cents": 4 }
}`}
          </pre>

          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-bold">First company client</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              TechForges&apos; upcoming nutrition tracking device is the first commercial integration
              of the API Program, streaming scan results straight onto the wearable.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90"
            >
              See the device
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
