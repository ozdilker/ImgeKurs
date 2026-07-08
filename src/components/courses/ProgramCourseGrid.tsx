"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/types";

export function ProgramCourseGrid({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <p className="col-span-full py-12 text-center text-slate-text">
        Eğitim programları yakında güncellenecek.
      </p>
    );
  }

  return (
    <>
      {courses.map((course, index) => (
        <AnimatedSection key={course.id} delay={index * 100}>
          <article
            className={cn(
              "group relative h-full overflow-hidden rounded-2xl bg-white shadow-card animate-card",
              course.isVip && "ring-2 ring-gold"
            )}
          >
            {course.isVip && (
              <div className="absolute right-0 top-0 z-10 translate-x-6 translate-y-4 rotate-45 bg-gold px-8 py-1 text-xs font-bold text-primary transition-transform duration-300 group-hover:scale-110">
                VIP
              </div>
            )}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded bg-primary/80 px-2 py-1 text-xs font-semibold text-white">
                {course.category}
              </span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-bold text-primary transition-colors duration-300 group-hover:text-gold">
                {course.title}
              </h3>
              <p className="mb-4 text-sm text-slate-text">{course.description}</p>
              <div className="mb-6 space-y-2 text-sm text-slate-text">
                {course.schedule && (
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold" />
                    {course.schedule}
                  </p>
                )}
                {course.classSize && (
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gold" />
                    {course.classSize}
                  </p>
                )}
              </div>
              <Link href={`/egitim-detay/${course.slug}`}>
                <Button
                  variant={course.isVip ? "gold" : "outline"}
                  className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
                  size="sm"
                >
                  {course.isVip ? "VIP Programı İncele" : "Programı İncele"}
                </Button>
              </Link>
            </div>
          </article>
        </AnimatedSection>
      ))}
    </>
  );
}
