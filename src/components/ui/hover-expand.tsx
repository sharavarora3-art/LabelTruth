import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface HoverExpandItem {
  label: string;
  sublabel?: string;
  image: string;
  imageAlt?: string;
  description?: string;
}

export interface HoverExpandProps {
  items: HoverExpandItem[];
  collapsedHeight?: number;
  expandedHeight?: number;
  className?: string;
}

export function HoverExpand({
  items,
  collapsedHeight = 68,
  expandedHeight = 320,
  className,
}: HoverExpandProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-card", className)}>
      {items.map((item, i) => {
        const isHovered = hoveredIndex === i;
        const isOtherHovered = hoveredIndex !== null && !isHovered;

        return (
          <div key={item.label} className="border-b border-border last:border-b-0">
            <motion.div
              role="button"
              tabIndex={0}
              aria-expanded={isHovered}
              aria-label={`Show ${item.label}`}
              className="relative cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              animate={{
                height: isHovered ? expandedHeight : collapsedHeight,
                opacity: isOtherHovered ? 0.55 : 1,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setHoveredIndex(isHovered ? null : i);
                }
              }}
            >
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.35 }}
              >
                <img
                  src={item.image}
                  alt={item.imageAlt ?? item.label}
                  loading="lazy"
                  className="size-full object-contain p-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
              </motion.div>

              <div className="relative flex h-[68px] items-center justify-between gap-4 px-6">
                <div className="flex min-w-0 items-baseline gap-4">
                  <span className="font-display text-xs font-bold text-accent-foreground/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display truncate text-lg font-bold">{item.label}</span>
                  {item.description && (
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      — {item.description}
                    </span>
                  )}
                </div>
                {item.sublabel && (
                  <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {item.sublabel}
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
