import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { HeroSlider } from "@/components/home/HeroSlider";
import { getCourses, getPageContent, getSiteSettings } from "@/lib/firebase/firestore";
import { defaultHeroSlides } from "@/lib/pages";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Anasayfa",
};

export default async function HomePage() {
  const [page, settings, courses] = await Promise.all([
    getPageContent("anasayfa"),
    getSiteSettings(),
    getCourses(),
  ]);

  const slides = page?.heroSlides?.length ? page.heroSlides : defaultHeroSlides;
  const featuredCourses = courses.filter((c) => c.status === "active").slice(0, 3);

  return (
    <>
      <HeroSlider slides={slides} />

      <section className="section-padding bg-white">
        <div className="container-main">
          <AnimateIn className="mb-12 text-center">
            <h2 className="heading-accent mb-4 text-3xl font-bold text-primary md:text-4xl">
              Eğitim Programlarımız
            </h2>
            <p className="text-slate-text">
              Her seviyeye uygun özel müfredat ve birebir takip
            </p>
          </AnimateIn>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course, i) => (
              <AnimateIn key={course.id} delay={i * 120}>
                <article className="group animate-card overflow-hidden rounded-2xl bg-white shadow-card">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16">
        <div className="container-main">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {settings.stats.map((stat, i) => (
              <AnimateIn key={stat.label} delay={i * 100} direction="up">
                <div className="text-center">
                  <p className="mb-2 text-4xl font-bold text-gold md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      <AnimateIn>
        <section className="bg-surface-gray py-12">
          <div className="container-main flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/iletisim">
              <Button variant="gold" size="lg">
                Hemen Başvur
              </Button>
            </Link>
            <Link href="/sayfa/hakkimizda">
              <Button variant="outline" size="lg">
                Detaylı Bilgi
              </Button>
            </Link>
          </div>
        </section>
      </AnimateIn>
    </>
  );
}
