import Image from "next/image";
import { getGalleryItems } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
};

export default async function GalleryPage() {
  const items = await getGalleryItems();
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <>
      <section className="section-padding bg-white pt-24">
        <div className="container-main text-center">
          <h1 className="heading-accent mb-4 text-3xl font-bold text-primary md:text-5xl">
            Galeri
          </h1>
          <p className="text-slate-text">
            Eğitim ortamımızdan ve etkinliklerimizden kareler
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-main">
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
            {items.map((item) => (
              <figure
                key={item.id}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card"
              >
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
