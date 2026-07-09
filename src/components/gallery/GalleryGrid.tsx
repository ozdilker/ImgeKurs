"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import type { GalleryItem } from "@/lib/types";

type GalleryGridProps = {
  items: GalleryItem[];
  categories: string[];
};

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || items.length === 0) return null;
      return (index - 1 + items.length) % items.length;
    });
  }, [items.length]);

  const goNext = useCallback(() => {
    setActiveIndex((index) => {
      if (index === null || items.length === 0) return null;
      return (index + 1) % items.length;
    });
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, closeLightbox, goPrev, goNext]);

  return (
    <>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full bg-surface-gray px-4 py-2 text-sm font-medium text-primary"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="col-span-full py-12 text-center text-slate-text">
            Galeri görselleri yakında eklenecek.
          </p>
        ) : (
          items.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 80}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group animate-card relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-card"
                aria-label={`${item.title} görselini büyüt`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4 text-left">
                  <span className="block font-semibold text-white">{item.title}</span>
                  <span className="block text-xs text-white/70">{item.category}</span>
                </span>
              </button>
            </AnimatedSection>
          ))
        )}
      </div>

      {activeItem && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeItem.title} görseli`}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Kapat"
          >
            <X className="h-6 w-6" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goPrev();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Önceki görsel"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  goNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Sonraki görsel"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}

          <div
            className="relative flex max-h-[85vh] w-full max-w-5xl flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
                priority
              />
            </div>

            <div className="mt-4 text-center text-white">
              <p className="text-lg font-semibold">{activeItem.title}</p>
              <p className="text-sm text-white/70">
                {activeItem.category}
                {items.length > 1 && (
                  <span className="ml-2">
                    · {activeIndex + 1} / {items.length}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
