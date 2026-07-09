"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";

type GalleryLightboxProps = {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onChange,
}: GalleryLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeItem = items[activeIndex];

  const goPrev = useCallback(() => {
    onChange((activeIndex - 1 + items.length) % items.length);
  }, [activeIndex, items.length, onChange]);

  const goNext = useCallback(() => {
    onChange((activeIndex + 1) % items.length);
  }, [activeIndex, items.length, onChange]);

  useEffect(() => {
    setMounted(true);
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrev, onClose]);

  if (!mounted || !activeItem) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[200] flex flex-col transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label={`${activeItem.title} görseli`}
    >
      <div
        className="absolute inset-0 bg-primary/95 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-4 text-white md:px-6">
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-semibold">{activeItem.title}</p>
          <p className="text-sm text-white/70">
            {activeItem.category}
            {items.length > 1 && (
              <span className="ml-2">
                · {activeIndex + 1} / {items.length}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-full border border-white/20 bg-white/10 p-2.5 transition-colors hover:bg-white/20"
          aria-label="Kapat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-14 md:px-20"
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || items.length < 2) return;
          const delta = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) < 48) return;
          if (delta > 0) goPrev();
          else goNext();
          touchStartX.current = null;
        }}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-white/20 md:left-5"
            aria-label="Önceki görsel"
          >
            <ChevronLeft className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        )}

        <div
          key={activeItem.id}
          className="flex max-h-full w-full max-w-6xl items-center justify-center animate-fade-in"
          onClick={(event) => event.stopPropagation()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeItem.imageUrl}
            alt={activeItem.title}
            className="max-h-[68vh] w-auto max-w-full rounded-lg object-contain shadow-2xl md:max-h-[72vh]"
          />
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-white/20 md:right-5"
            aria-label="Sonraki görsel"
          >
            <ChevronRight className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        )}
      </div>

      {items.length > 1 && (
        <div className="relative z-10 border-t border-white/10 px-4 py-4 md:px-6">
          <div className="mx-auto flex max-w-5xl gap-2 overflow-x-auto pb-1">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(index)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all md:h-20 md:w-28 ${
                  index === activeIndex
                    ? "border-gold ring-2 ring-gold/40"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`${item.title} görseline git`}
                aria-current={index === activeIndex}
              >
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
