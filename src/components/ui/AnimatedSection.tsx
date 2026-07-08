"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up" as const,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}) {
  return (
    <AnimateIn className={className} delay={delay} direction={direction}>
      {children}
    </AnimateIn>
  );
}
