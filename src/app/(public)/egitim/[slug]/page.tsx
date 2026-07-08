import Image from "next/image";
import { notFound } from "next/navigation";
import { getVideoLessonBySlug, getVideoLessons } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const lessons = await getVideoLessons();
  return lessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getVideoLessonBySlug(slug);
  return { title: lesson?.title ?? "Eğitim Videosu" };
}

export default async function VideoLessonPage({ params }: Props) {
  const { slug } = await params;
  const lesson = await getVideoLessonBySlug(slug);
  if (!lesson) notFound();

  return (
    <section className="section-padding bg-white pt-24">
      <div className="container-main max-w-4xl">
        <span className="mb-2 inline-block rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-primary">
          {lesson.grade}
        </span>
        <h1 className="mb-4 text-3xl font-bold text-primary">{lesson.title}</h1>
        <p className="mb-8 text-slate-text">{lesson.description}</p>

        <div className="mb-8 aspect-video overflow-hidden rounded-2xl shadow-card">
          <iframe
            src={lesson.videoUrl}
            title={lesson.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>

        <div className="relative h-48 overflow-hidden rounded-2xl">
          <Image
            src={lesson.thumbnailUrl}
            alt={lesson.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
