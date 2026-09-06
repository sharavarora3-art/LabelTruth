import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleNext = () => setActive((prev) => (prev + 1) % testimonials.length);
  const handlePrev = () =>
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const isActive = (index: number) => index === active;

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(
      () => setActive((prev) => (prev + 1) % testimonials.length),
      5000,
    );
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  const rotations = [-8, -4, 0, 4, 8];
  const current = testimonials[active] ?? testimonials[0]!;

  return (
    <div className="mx-auto grid gap-14 md:grid-cols-2" aria-roledescription="carousel" aria-label="LabelTruth testimonials">
      <div className="relative h-80 w-full">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.src}
              initial={{ opacity: 0, scale: 0.9, z: -100, rotate: (rotations[index % 5] ?? 0) }}
              animate={{
                opacity: isActive(index) ? 1 : 0.7,
                scale: isActive(index) ? 1 : 0.95,
                zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                y: isActive(index) ? [0, -60, 0] : 0,
                rotate: isActive(index) ? 0 : (rotations[index % 5] ?? 0),
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 origin-bottom"
            >
              <img
                src={testimonial.src}
                alt={testimonial.name}
                loading="lazy"
                className="size-full rounded-3xl object-cover object-center shadow-card"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-between py-4">
          <motion.div
          key={active}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="font-display text-2xl font-bold">{current.name}</h3>
          <p className="text-sm text-muted-foreground">{current.designation}</p>
          <p className="mt-6 text-lg leading-relaxed" aria-live="polite">
            {current.quote.split(" ").map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={{ filter: "blur(8px)", opacity: 0, y: 6 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.02 * index }}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </p>
        </motion.div>

        <div className="flex gap-4 pt-10">
            <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="group grid size-11 place-items-center rounded-full border border-border bg-card transition hover:bg-muted"
          >
            <ArrowLeft className="size-5 transition group-hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="group grid size-11 place-items-center rounded-full border border-border bg-card transition hover:bg-muted"
          >
            <ArrowRight className="size-5 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
