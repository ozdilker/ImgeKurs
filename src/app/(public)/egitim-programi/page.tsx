import { ProgramCourseGrid } from "@/components/courses/ProgramCourseGrid";
import { PageHero } from "@/components/layout/PageHero";
import { PreRegistrationForm } from "@/components/forms/PreRegistrationForm";
import { getCourses, getPageContent } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eğitim Programları",
};

export default async function ProgramsPage() {
  const [page, courses] = await Promise.all([
    getPageContent("egitim-programi"),
    getCourses(),
  ]);
  const activeCourses = courses.filter((c) => c.status === "active");
  const featuredCourse = activeCourses.find((c) => c.slug === "tyt-ayt") ?? activeCourses[0];

  return (
    <>
      <PageHero
        page={page}
        fallbackTitle="Eğitim Programlarımız"
        fallbackSubtitle="Her seviyeye uygun özel müfredat ve birebir takip ile öğrenci başarısını en üst düzeye çıkarıyoruz."
        dark={false}
      />

      <section className="pb-16 pt-8">
        <div className="container-main">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <ProgramCourseGrid courses={activeCourses.slice(0, 3)} />
          </div>
        </div>
      </section>

      {featuredCourse && (
        <section className="section-padding bg-surface-gray">
          <div className="container-main grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent-orange">
                Detaylı İnceleme
              </p>
              <h2 className="mb-6 text-3xl font-bold text-primary">
                {featuredCourse.title} Detayları
              </h2>
              <p className="mb-8 text-slate-text leading-relaxed">
                {featuredCourse.description}
              </p>

              {featuredCourse.features && (
                <div className="mb-8">
                  <h3 className="mb-4 text-lg font-semibold text-primary">
                    Program İçeriği
                  </h3>
                  <ul className="space-y-2">
                    {featuredCourse.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-text">
                        <span className="text-gold">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {featuredCourse.scheduleTable && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-primary">
                    Ders Programı (Örnek)
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-outline/10">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-gray">
                        <tr>
                          <th className="px-4 py-3 text-left font-semibold text-primary">
                            Gün
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-primary">
                            Saat
                          </th>
                          <th className="px-4 py-3 text-left font-semibold text-primary">
                            İçerik
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {featuredCourse.scheduleTable.map((row, i) => (
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
            </div>

            <div>
              <PreRegistrationForm />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
