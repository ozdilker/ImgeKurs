import Image from "next/image";
import Link from "next/link";
import { Eye, GraduationCap, Medal, Monitor, Target, UserSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getPageContent } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
};

const iconMap: Record<string, React.ReactNode> = {
  target: <Target className="h-6 w-6" />,
  eye: <Eye className="h-6 w-6" />,
  "user-search": <UserSearch className="h-6 w-6" />,
  "graduation-cap": <GraduationCap className="h-6 w-6" />,
  monitor: <Monitor className="h-6 w-6" />,
  medal: <Medal className="h-6 w-6" />,
};

export default async function AboutPage() {
  const page = await getPageContent("hakkimizda");
  if (!page) return null;

  return (
    <>
      <section className="bg-primary py-20 text-center">
        <div className="container-main">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {page.heroTitle}
          </h1>
          <p className="mx-auto max-w-2xl text-white/70">{page.heroSubtitle}</p>
          <Link href="/iletisim" className="mt-8 inline-block">
            <Button variant="gold">Detaylı Bilgi Alın</Button>
          </Link>
        </div>
      </section>

      {page.sections.map((section) => {
        if (section.type === "text-image") {
          return (
            <section key={section.id} className="section-padding bg-white">
              <div className="container-main grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <h2 className="heading-accent-left mb-6 text-3xl font-bold text-primary">
                    {section.title}
                  </h2>
                  {section.content?.split("\n\n").map((p, i) => (
                    <p key={i} className="mb-4 text-slate-text leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {section.imageUrl && (
                  <div className="relative h-80 overflow-hidden rounded-2xl shadow-card lg:h-96">
                    <Image
                      src={section.imageUrl}
                      alt={section.title ?? ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </section>
          );
        }

        if (section.type === "mission-vision") {
          return (
            <section key={section.id} className="section-padding bg-surface-gray">
              <div className="container-main grid gap-8 md:grid-cols-2">
                {section.items?.map((item, i) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white p-8 shadow-card"
                    style={{
                      borderTop: `3px solid ${i === 0 ? "#1a3d5d" : "#d4af37"}`,
                    }}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {item.icon && iconMap[item.icon]}
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="text-slate-text">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        if (section.type === "values") {
          return (
            <section key={section.id} className="section-padding bg-white">
              <div className="container-main">
                <h2 className="heading-accent mb-12 text-center text-3xl font-bold text-primary">
                  {section.title}
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {section.items?.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl bg-surface-gray p-6 text-center"
                    >
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-orange/10 text-accent-orange">
                        {item.icon && iconMap[item.icon]}
                      </div>
                      <h3 className="mb-2 font-semibold text-primary">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-text">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        return null;
      })}

      <section className="section-padding bg-primary">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-3xl font-bold text-gold">
              Uzman Eğitim Kadromuz
            </h2>
            <p className="mb-8 text-white/70 leading-relaxed">
              Alanında uzman, deneyimli ve öğrenci odaklı eğitmenlerimizle
              her öğrencinin potansiyelini en üst düzeye çıkarıyoruz.
            </p>
            <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-primary">
              Tüm Kadroyu İncele →
            </Button>
          </div>
          <div className="relative h-80 overflow-hidden rounded-2xl border-2 border-gold/30 lg:h-96">
            <Image
              src="https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80"
              alt="Eğitim kadrosu"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>
    </>
  );
}
