"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  slides: HeroSlide[];
  autoPlayMs?: number;
};

export function HeroSlider({ slides, autoPlayMs = 5000 }: Props) {
  const activeSlides = slides
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (activeSlides.length === 0 || isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + activeSlides.length) % activeSlides.length);
      setTimeout(() => setIsTransitioning(false), 600);
    },
    [activeSlides.length, isTransitioning]
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(next, autoPlayMs);
    return () => clearInterval(timer);
  }, [activeSlides.length, autoPlayMs, next]);

  if (activeSlides.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-primary">
      <div className="relative aspect-[21/9] min-h-[280px] w-full sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px]">
        {activeSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              index === current ? "z-10 opacity-100" : "z-0 opacity-0"
            )}
          >
            {slide.link ? (
              <Link href={slide.link} className="block h-full w-full">
                <SlideImage slide={slide} priority={index === 0} />
              </Link>
            ) : (
              <SlideImage slide={slide} priority={index === 0} />
            )}
          </div>
        ))}

        {activeSlides.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label="Önceki slayt"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label="Sonraki slayt"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {activeSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goTo(index)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    index === current
                      ? "w-8 bg-gold"
                      : "w-2.5 bg-white/50 hover:bg-white/80"
                  )}
                  aria-label={`Slayt ${index + 1}: ${slide.title}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function SlideImage({
  slide,
  priority,
}: {
  slide: HeroSlide;
  priority?: boolean;
}) {
  return (
    <Image
      src={slide.imageUrl}
      alt={slide.title}
      fill
      className="object-cover object-center"
      priority={priority}
      sizes="100vw"
    />
  );
}
