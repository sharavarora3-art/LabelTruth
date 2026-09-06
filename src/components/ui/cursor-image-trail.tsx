import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

export interface CursorImageTrailProps {
  items: React.ReactNode[];
  itemSize?: number;
  trailLength?: number;
  spawnDistance?: number;
  rotationRange?: number;
  className?: string;
  children?: React.ReactNode;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  rotation: number;
  itemIndex: number;
}

let _id = 0;
const nextId = () => ++_id;

export function CursorImageTrail({
  items,
  itemSize = 120,
  trailLength = 8,
  spawnDistance = 80,
  rotationRange = 20,
  className,
  children,
}: CursorImageTrailProps) {
  const [trail, setTrail] = React.useState<TrailItem[]>([]);
  const lastPos = React.useRef<{ x: number; y: number } | null>(null);
  const itemCounter = React.useRef(0);
  const containerElRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = containerElRef.current;
    if (!el) return;

    const onLeave = () => setTrail([]);

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (lastPos.current) {
        const dx = x - lastPos.current.x;
        const dy = y - lastPos.current.y;
        if (Math.sqrt(dx * dx + dy * dy) < spawnDistance) return;
      }
      lastPos.current = { x, y };

      const rotation = (Math.random() * 2 - 1) * rotationRange;
      const itemIndex = itemCounter.current % items.length;
      itemCounter.current += 1;

      setTrail((prev) => [...prev, { id: nextId(), x, y, rotation, itemIndex }].slice(-trailLength));
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [items, spawnDistance, rotationRange, trailLength]);

  const total = trail.length;

  return (
    <div ref={containerElRef} className={cn("relative", className)}>
      {children}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {trail.map((item, i) => {
            const age = total - 1 - i;
            const scale = 0.6 + 0.4 * (1 - age / trailLength);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.4, rotate: item.rotation }}
                animate={{ opacity: 0.9 - age * 0.09, scale, rotate: item.rotation }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
                className="absolute"
                style={{
                  left: item.x - itemSize / 2,
                  top: item.y - itemSize / 2,
                  width: itemSize,
                  height: itemSize,
                }}
              >
                <div className="grid size-full place-items-center">{items[item.itemIndex]}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
