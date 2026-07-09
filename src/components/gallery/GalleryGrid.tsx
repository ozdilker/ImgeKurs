"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import type { GalleryItem } from "@/lib/types";

type GalleryGridProps = {
  items: GalleryItem[];
  categories: string[];
};

export function GalleryGrid({ items, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (activeCategory === "all") return items;
    return items.filter((item) => item.category === activeCategory);
  }, [activeCategory, items]);

  useEffect(() => {
    setLightboxIndex(null);
  }, [activeCategory]);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <>
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-primary text-white"
                : "bg-surface-gray text-primary hover:bg-primary/10"
            }`}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-surface-gray text-primary hover:bg-primary/10"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.length === 0 ? (
          <p className="col-span-full py-12 text-center text-slate-text">
            {items.length === 0
              ? "Galeri görselleri yakında eklenecek."
              : "Bu kategoride görsel bulunmuyor."}
          </p>
        ) : (
          filteredItems.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 60}>
              <button
                type="button"
                onClick={() => openLightbox(index)}
                className="group animate-card relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-gray shadow-card"
                aria-label={`${item.title} görselini büyüt`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <span className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/20" />
                <span className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100">
                  <ZoomIn className="h-5 w-5" />
                </span>
                <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-primary/95 via-primary/70 to-transparent p-4 text-left opacity-90 transition-transform duration-300 group-hover:translate-y-0">
                  <span className="block font-semibold text-white">{item.title}</span>
                  <span className="block text-xs text-white/75">{item.category}</span>
                </span>
              </button>
            </AnimatedSection>
          ))
        )}
      </div>

      {lightboxIndex !== null && filteredItems.length > 0 && (
        <GalleryLightbox
          items={filteredItems}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
}
