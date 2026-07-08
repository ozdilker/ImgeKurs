import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PreRegistrationForm } from "@/components/forms/PreRegistrationForm";
import { getCourseBySlug, getCourses } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course?.title ?? "Eğitim Detayı" };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <>
      <section className="relative flex h-64 items-end bg-primary md:h-80">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        <div className="container-main relative z-10 pb-8">
          <span className="mb-2 inline-block rounded bg-gold px-3 py-1 text-xs font-semibold text-primary">
            {course.category}
          </span>
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {course.title}
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="mb-8 text-lg text-slate-text leading-relaxed">
              {course.description}
            </p>

            <div className="mb-8 flex flex-wrap gap-6">
              {course.schedule && (
                <div className="flex items-center gap-2 text-slate-text">
                  <Clock className="h-5 w-5 text-gold" />
                  {course.schedule}
                </div>
              )}
              {course.classSize && (
                <div className="flex items-center gap-2 text-slate-text">
                  <Users className="h-5 w-5 text-gold" />
                  {course.classSize}
                </div>
              )}
            </div>

            {course.features && (
              <div className="mb-8">
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  Program İçeriği
                </h2>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {course.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 rounded-lg bg-surface-gray px-4 py-3 text-slate-text"
                    >
                      <span className="text-gold">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.scheduleTable && (
              <div>
                <h2 className="mb-4 text-xl font-semibold text-primary">
                  Ders Programı
                </h2>
                <div className="overflow-hidden rounded-xl border border-outline/10">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-gray">
                      <tr>
                        <th className="px-4 py-3 text-left">Gün</th>
                        <th className="px-4 py-3 text-left">Saat</th>
                        <th className="px-4 py-3 text-left">İçerik</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.scheduleTable.map((row, i) => (
                        <tr
                          key={row.day}
                          className={i % 2 === 0 ? "bg-white" : "bg-surface-gray/50"}
                        >
                          <td className="px-4 py-3">{row.day}</td>
                          <td className="px-4 py-3">{row.time}</td>
                          <td className="px-4 py-3">{row.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <Link href="/egitim-programi" className="mt-8 inline-block">
              <Button variant="outline" size="sm">
                ← Tüm Programlar
              </Button>
            </Link>
          </div>

          <div>
            <PreRegistrationForm />
          </div>
        </div>
      </section>
    </>
  );
}
