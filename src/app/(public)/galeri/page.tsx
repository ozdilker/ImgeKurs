import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { getGalleryItems, getPageContent } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
};

export default async function GalleryPage() {
  const [page, items] = await Promise.all([
    getPageContent("galeri"),
    getGalleryItems(),
  ]);
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <>
      <PageHero
        page={page}
        fallbackTitle="Galeri"
        fallbackSubtitle="Eğitim ortamımızdan ve etkinliklerimizden kareler"
        dark={false}
      />

      <section className="pb-20 pt-8">
        <div className="container-main">
          <AnimatedSection>
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className="rounded-full bg-surface-gray px-4 py-2 text-sm font-medium text-primary"
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.length === 0 ? (
              <p className="col-span-full py-12 text-center text-slate-text">
                Galeri görselleri yakında eklenecek.
              </p>
            ) : (
              items.map((item, i) => (
              <AnimatedSection key={item.id} delay={i * 80}>
                <figure className="group animate-card relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4">
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-white/70">{item.category}</p>
                  </figcaption>
                </figure>
              </AnimatedSection>
              ))
            )}
          </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
