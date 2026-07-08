import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getCourses, getSiteSettings } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anasayfa",
};

export default async function HomePage() {
  const [settings, courses] = await Promise.all([
    getSiteSettings(),
    getCourses(),
  ]);

  const featuredCourses = courses.filter((c) => c.status === "active").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-primary">
        <Image
          src={settings.heroImageUrl}
          alt="Eğitim ortamı"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/60" />
        <div className="container-main relative z-10 py-20 text-center md:py-28">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {settings.heroTitle}{" "}
            <span className="text-gold">{settings.heroHighlight}</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">
            {settings.heroSubtitle}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/iletisim">
              <Button variant="gold" size="lg">
                Hemen Başvur
              </Button>
            </Link>
            <Link href="/sayfa/hakkimizda">
              <Button variant="ghost" size="lg">
                Detaylı Bilgi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="mb-12 text-center">
            <h2 className="heading-accent mb-4 text-3xl font-bold text-primary md:text-4xl">
              Eğitim Programlarımız
            </h2>
            <p className="text-slate-text">
              Her seviyeye uygun özel müfredat ve birebir takip
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {course.tag && (
                    <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-primary">
                      {course.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-primary">
                    {course.title}
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-slate-text">
                    {course.description}
                  </p>
                  <Link href={`/egitim-detay/${course.slug}`}>
                    <Button variant="outline" className="w-full" size="sm">
                      İncele
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-16">
        <div className="container-main">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {settings.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="mb-2 text-4xl font-bold text-gold md:text-5xl">
                  {stat.value}
                </p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
