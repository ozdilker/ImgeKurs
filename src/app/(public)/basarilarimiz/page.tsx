import Link from "next/link";
import {
  Calendar,
  GraduationCap,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SuccessStoryGrid } from "@/components/success/SuccessStoryGrid";
import { getPageContent, getSuccessStories } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Başarılarımız",
};

const statIcons = [Trophy, GraduationCap, Users, Calendar];

export default async function SuccessPage() {
  const [page, stories] = await Promise.all([
    getPageContent("basarilarimiz"),
    getSuccessStories(),
  ]);

  const quickStats = [
    { value: "500+", label: "İlk 1000 Derecesi" },
    { value: "%98", label: "Üniversiteye Yerleşme" },
    { value: "2500+", label: "Başarılı Öğrenci" },
    { value: "15+", label: "Yıllık Tecrübe" },
  ];

  const growthData = [
    { year: "2021", percent: 78, color: "bg-primary" },
    { year: "2022", percent: 87, color: "bg-accent-orange" },
    { year: "2023", percent: 94, color: "bg-gold" },
  ];

  return (
    <>
      <PageHero
        page={page}
        fallbackTitle="Başarı Yolculuğumuzda Sizinle Gurur Duyuyoruz"
        fallbackSubtitle="Her yıl artan başarı grafiklerimizle geleceği birlikte inşa ediyoruz."
      />

      <AnimatedSection>
      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, i) => {
              const Icon = statIcons[i];
              return (
                <div
                  key={stat.label}
                  className="animate-card rounded-2xl bg-white p-6 text-center shadow-card"
                >
                  <Icon className="mx-auto mb-3 h-8 w-8 text-gold" />
                  <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-slate-text">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-gray">
        <div className="container-main">
          <AnimatedSection>
            <h2 className="heading-accent mb-12 text-center text-3xl font-bold text-primary">
              Gurur Tablomuz
            </h2>
          </AnimatedSection>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <SuccessStoryGrid stories={stories} />
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection delay={150}>
      <section className="section-padding bg-white">
        <div className="container-main grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-6 text-3xl font-bold text-primary">
              Yıllara Göre Yükselen Grafiğimiz
            </h2>
            <p className="mb-8 text-slate-text">
              Eğitim kalitemizi sürekli geliştirerek her yıl daha yüksek
              başarı oranları elde ediyoruz.
            </p>
            <div className="space-y-4">
              {growthData.map((item) => (
                <div key={item.year}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-semibold text-primary">{item.year}</span>
                    <span className="text-slate-text">{item.percent}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-surface-gray">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex h-64 items-end justify-center gap-4 rounded-2xl bg-surface-gray p-8">
            {growthData.map((item) => (
              <div key={item.year} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 rounded-t-lg ${item.color}`}
                  style={{ height: `${item.percent * 1.5}px` }}
                />
                <span className="text-xs text-slate-text">{item.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-gray">
        <div className="container-main">
          <h2 className="heading-accent mb-12 text-center text-3xl font-bold text-primary">
            Veli ve Öğrenci Yorumları
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                name: "Ayşe Demir",
                role: "Veli",
                text: "Kızımın LGS sürecinde aldığımız destek mükemmeldi. Disiplinli ve sıcak bir ortam.",
              },
              {
                name: "Burak Yılmaz",
                role: "Mezun Öğrenci",
                text: "TYT-AYT hazırlığımda birebir takip sistemi sayesinde hedeflediğim bölüme yerleştim.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="animate-card relative rounded-2xl bg-white p-8 shadow-card"
              >
                <span className="absolute right-6 top-4 text-6xl font-serif text-gold/20">
                  &ldquo;
                </span>
                <p className="mb-4 text-slate-text leading-relaxed">
                  {review.text}
                </p>
                <p className="font-semibold text-primary">{review.name}</p>
                <p className="text-sm text-slate-text">{review.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      <AnimatedSection direction="fade">
      <section className="bg-primary py-20 text-center">
        <div className="container-main">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Sıradaki Başarı Hikayesi Sizinki Olsun
          </h2>
          <p className="mb-8 text-white/70">
            VIP eğitim programlarımıza hemen kayıt olun.
          </p>
          <Link href="/iletisim">
            <Button variant="gold" size="lg">
              Hemen Kayıt Ol
            </Button>
          </Link>
        </div>
      </section>
      </AnimatedSection>
    </>
  );
}
