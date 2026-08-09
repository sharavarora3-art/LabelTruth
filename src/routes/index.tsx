import { createFileRoute, Link } from "@tanstack/react-router";

import { AnnouncementSlider } from "@/components/AnnouncementSlider";
import { DeviceTab } from "@/components/DeviceTab";
import { PartnerSlider } from "@/components/PartnerSlider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TrackedItems } from "@/components/TrackedItems";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { CursorImageTrail } from "@/components/ui/cursor-image-trail";
import { HoverExpand } from "@/components/ui/hover-expand";
import {
  categoryShowcase,
  historyMilestones,
  testimonials,
  trackedItems,
  trackedNotice,
} from "@/lib/site-data";

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
    <section className="mx-auto max-w-6xl px-5 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="luxe-rule mt-5 w-28" />
      {lead && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{lead}</p>
      )}
      <div className="mt-9">{children}</div>
    </section>
  );
}

function Landing() {
  const trailItems = trackedItems.slice(0, 8).map((item) => (
    <img
      key={item.item}
      src={item.image}
      alt=""
      aria-hidden
      className="size-full object-contain drop-shadow-2xl"
    />
  ));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <CursorImageTrail items={trailItems} itemSize={110} trailLength={7} spawnDistance={90}>
        <section
          className="relative overflow-hidden px-5 pb-24 pt-20 text-primary-foreground"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="relative mx-auto max-w-6xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              The P:C ratio standard
            </span>
            <h1 className="mt-7 max-w-4xl text-5xl font-bold leading-[1.02] sm:text-7xl">
              Photograph the pack.
              <span className="text-luxe block">See if it is telling the truth.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 sm:text-base">
              LabelTruth reads the label, judges healthy or not, and scores the gap between what the
              product actually delivers and what the packaging claims — the{" "}
              <strong className="font-semibold text-gold">Product-to-Claim (P:C) ratio</strong> —
              plus a 0-100 trust score and a stated confidence band.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/scan"
                className="rounded-full px-7 py-3 text-sm font-bold text-gold-foreground shadow-luxe transition hover:opacity-90"
                style={{ background: "var(--gradient-luxe)" }}
              >
                Scan a pack now
              </Link>
              <Link
                to="/api"
                className="rounded-full border border-primary-foreground/25 px-7 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                Explore the API Program
              </Link>
            </div>
            <dl className="mt-14 grid max-w-4xl gap-4 sm:grid-cols-4">
              {[
                ["0.00 – 2.00", "P:C ratio scale"],
                ["0 – 100", "Pack trust score"],
                ["Low / Med / High", "Confidence band"],
                [`${trackedItems.length}+`, "Products audited"],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur"
                >
                  <dt className="font-display text-xl font-bold text-gold">{v}</dt>
                  <dd className="text-[11px] uppercase tracking-[0.16em] text-primary-foreground/70">
                    {l}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 max-w-xl text-xs italic text-primary-foreground/60">{trackedNotice}</p>
          </div>
        </section>
      </CursorImageTrail>

      <Section
        eyebrow="Announcements"
        title="What's happening at LabelTruth"
        lead="Partnerships, the API Program, our own evaluation methodology and public-sector work."
      >
        <AnnouncementSlider />
      </Section>

      <Section
        eyebrow="Categories"
        title="Every aisle, audited"
        lead="Hover a category to open the shelf. Averages are computed from our reference audits."
      >
        <HoverExpand items={categoryShowcase} />
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
        lead="Drag or hover any pack to turn it in 3D and reveal its coverage note."
      >
        <TrackedItems />
      </Section>

      <Section
        eyebrow="In their words"
        title="Trusted by the people who read panels for a living"
        lead="Manufacturers, retailers, device makers and policy teams on scoring with LabelTruth."
      >
        <AnimatedTestimonials testimonials={testimonials} autoplay />
      </Section>

      <Section
        eyebrow="Our history"
        title="From a working group to a scoring standard"
        lead="LabelTruth grew out of EcoTruth Group's label-truth research."
      >
        <ol className="relative space-y-6 border-l border-border pl-6">
          {historyMilestones.map((m) => (
            <li key={m.year}>
              <span className="absolute -left-[7px] mt-1.5 size-3 rounded-full bg-gold" />
              <p className="font-display text-sm font-bold text-gold">{m.year}</p>
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
