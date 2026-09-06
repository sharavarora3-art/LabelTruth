import { useEffect, useState } from "react";

import { announcements } from "@/lib/site-data";

export function AnnouncementSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setInterval(() => setI((p) => (p + 1) % announcements.length), 5500);
    return () => clearInterval(t);
  }, [paused, reducedMotion]);

  const a = announcements[i]!;

  return (
    <div
      aria-roledescription="carousel"
      aria-label="LabelTruth announcements"
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid md:grid-cols-2">
        <div className="relative h-56 md:h-full">
          {announcements.map((item, idx) => (
            <img
              key={item.title}
              src={item.image}
              alt={item.title}
              loading="lazy"
              width={1024}
              height={640}
              className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
              aria-hidden={idx !== i}
            />
          ))}
        </div>
        <div className="flex flex-col justify-between gap-5 p-6 sm:p-8">
          <div>
            <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-secondary-foreground">
              {a.tag}
            </span>
            <p className="sr-only" aria-live="polite">Announcement {i + 1} of {announcements.length}</p>
            <h3 className="mt-4 text-xl font-bold leading-snug sm:text-2xl">{a.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
          </div>
            <div className="flex flex-wrap items-center gap-2" aria-label="Choose an announcement">
            {announcements.map((item, idx) => (
              <button
                key={item.title}
                  type="button"
                onClick={() => setI(idx)}
                aria-label={`Show announcement ${idx + 1}`}
                  aria-current={idx === i ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-3 bg-border"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
