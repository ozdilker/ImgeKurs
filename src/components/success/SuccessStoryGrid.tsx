"use client";

import Image from "next/image";
import { Building2, GraduationCap, Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { resolveSuccessStoryImage } from "@/lib/success-story-utils";
import type { SuccessStory } from "@/lib/types";

export function SuccessStoryGrid({ stories }: { stories: SuccessStory[] }) {
  if (stories.length === 0) {
    return (
      <p className="col-span-full py-12 text-center text-slate-text">
        Gurur tablomuz yakında güncellenecek.
      </p>
    );
  }

  return (
    <>
      {stories.map((story, index) => (
        <AnimatedSection key={story.id} delay={index * 90}>
          <article className="group animate-card h-full overflow-hidden rounded-2xl bg-white shadow-card">
            <div className="relative h-52 overflow-hidden bg-surface-gray">
              <Image
                src={resolveSuccessStoryImage(story.imageUrl)}
                alt={story.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <Star className="absolute right-3 top-3 h-6 w-6 fill-gold text-gold drop-shadow" />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-primary transition-colors group-hover:text-gold">
                {story.name}
              </h3>
              {story.rank && (
                <p className="mt-1 text-sm font-semibold text-gold">{story.rank}</p>
              )}
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-text">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-orange" />
                <span>{story.university}</span>
              </p>
              <p className="mt-2 flex items-start gap-2 text-sm text-slate-text">
                <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{story.department}</span>
              </p>
              {story.quote && (
                <blockquote className="mt-4 rounded-lg bg-surface-gray p-4 text-sm italic text-slate-text">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              )}
            </div>
          </article>
        </AnimatedSection>
      ))}
    </>
  );
}
