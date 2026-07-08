"use client";

import { AnimateIn } from "@/components/ui/AnimateIn";
import type { PageContent } from "@/lib/types";

type PageHeroProps = {
  page: PageContent | null;
  fallbackTitle: string;
  fallbackSubtitle?: string;
  centered?: boolean;
  dark?: boolean;
};

export function PageHero({
  page,
  fallbackTitle,
  fallbackSubtitle,
  centered = true,
  dark = true,
}: PageHeroProps) {
  const title = page?.heroTitle ?? fallbackTitle;
  const subtitle = page?.heroSubtitle ?? fallbackSubtitle;

  return (
    <AnimateIn direction="fade">
      <section
        className={`py-20 ${dark ? "bg-primary text-white" : "bg-white text-primary"} ${centered ? "text-center" : ""}`}
      >
        <div className="container-main">
          <h1 className="mb-4 text-3xl font-bold md:text-5xl">{title}</h1>
          {subtitle && (
            <p
              className={`mx-auto max-w-2xl ${dark ? "text-white/70" : "text-slate-text"}`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </section>
    </AnimateIn>
  );
}
