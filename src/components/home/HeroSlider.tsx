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
    <section className="bg-surface px-4 py-6 md:py-8">
      <div className="mx-auto w-full max-w-[1248px]">
        <div className="slider-shadow relative overflow-hidden rounded-2xl bg-white">
          <div className="relative aspect-[21/9] min-h-[200px] w-full sm:min-h-[280px] md:min-h-[340px] lg:min-h-[400px]">
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
                  className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/50 md:left-4 md:h-10 md:w-10"
                  aria-label="Önceki slayt"
                >
                  <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition hover:scale-110 hover:bg-black/50 md:right-4 md:h-10 md:w-10"
                  aria-label="Sonraki slayt"
                >
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                </button>

                <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-4">
                  {activeSlides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => goTo(index)}
                      className={cn(
                        "h-2 rounded-full transition-all duration-300",
                        index === current
                          ? "w-7 bg-gold md:w-8"
                          : "w-2 bg-white/50 hover:bg-white/80"
                      )}
                      aria-label={`Slayt ${index + 1}: ${slide.title}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
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
  const isLocal = slide.imageUrl.startsWith("/");

  if (isLocal) {
    return (
      <Image
        src={slide.imageUrl}
        alt={slide.title}
        fill
        className="object-cover object-center"
        priority={priority}
        sizes="(max-width: 1248px) 100vw, 1248px"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={slide.imageUrl}
      alt={slide.title}
      className="h-full w-full object-cover object-center"
    />
  );
}
