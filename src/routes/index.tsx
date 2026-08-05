import { createFileRoute, Link } from "@tanstack/react-router";

import { AnnouncementSlider } from "@/components/AnnouncementSlider";
import { DeviceTab } from "@/components/DeviceTab";
import { PartnerSlider } from "@/components/PartnerSlider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedItems } from "@/components/TrackedItems";
import { historyMilestones } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LabelTruth — Scan packaged food, get a P:C trust score" },
      {
        name: "description",
        content:
          "LabelTruth photographs any packaged food label and returns a healthy-or-not verdict, the Product-to-Claim (P:C) ratio, a 0-100 trust score and a confidence band.",
      },
      { property: "og:title", content: "LabelTruth — Scan packaged food, get a P:C trust score" },
      {
        property: "og:description",
        content:
          "Snap a food label and see whether the pack lives up to its claims, scored with the P:C ratio, a trust score and an explicit confidence band.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Section({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>
      {lead && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section
        className="px-5 pb-20 pt-16 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-6xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            The P:C ratio scanner
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-6xl">
            Photograph the pack. See if it&apos;s telling the truth.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
            LabelTruth reads the label, judges healthy or not, and scores the gap between what the
            product actually delivers and what the packaging claims — the{" "}
            <strong className="font-semibold text-accent">Product-to-Claim (P:C) ratio</strong> —
            plus a 0-100 trust score and a stated confidence band.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/scan"
              className="rounded-full bg-accent px-6 py-3 text-sm font-bold text-accent-foreground transition hover:opacity-90"
            >
              Scan a pack now
            </Link>
            <Link
              to="/api"
              className="rounded-full border border-primary-foreground/25 px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
            >
              Explore the API Program
            </Link>
          </div>
          <dl className="mt-12 grid max-w-3xl gap-4 sm:grid-cols-3">
            {[
              ["0.00 – 2.00", "P:C ratio scale"],
              ["0 – 100", "Pack trust score"],
              ["Low / Med / High", "Confidence band"],
            ].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-primary-foreground/10 p-4">
                <dt className="font-display text-xl font-bold text-accent">{v}</dt>
                <dd className="text-xs uppercase tracking-wide text-primary-foreground/70">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <Section
        eyebrow="Announcements"
        title="What's happening at LabelTruth"
        lead="Partnerships, the API Program, our own evaluation methodology and public-sector work."
      >
        <AnnouncementSlider />
      </Section>

      <Section
        eyebrow="Hardware"
        title="TechForges Nutrition Tracking Device (upcoming)"
        lead="Our first hardware partner and first API client. Switch between the live readout, the sync flow and the device specs."
      >
        <DeviceTab />
      </Section>

      <Section
        eyebrow="Partners & clients"
        title="Who we work with"
        lead="Manufacturers, retailers, device makers and data partners integrating LabelTruth scoring."
      >
        <PartnerSlider />
      </Section>

      <Section
        eyebrow="Coverage"
        title="Company food items tracked with LabelTruth"
        lead="Drag or hover any pack to turn it in 3D. Scores shown are from our reference audits."
      >
        <TrackedItems />
      </Section>

      <Section
        eyebrow="Our history"
        title="From a working group to a scoring standard"
        lead="LabelTruth grew out of EcoTruth Group's label-truth research."
      >
        <ol className="relative space-y-6 border-l border-border pl-6">
          {historyMilestones.map((m) => (
            <li key={m.year}>
              <span className="absolute -left-[7px] mt-1.5 size-3 rounded-full bg-primary" />
              <p className="font-display text-sm font-bold text-primary">{m.year}</p>
              <h3 className="mt-1 text-base font-bold">{m.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <SiteFooter />
    </div>
  );
}
