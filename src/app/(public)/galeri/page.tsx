import { PageHero } from "@/components/layout/PageHero";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getGalleryItems, getPageContent } from "@/lib/firebase/firestore";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const [page, items] = await Promise.all([
    getPageContent("galeri"),
    getGalleryItems(),
  ]);
  const categories = [...new Set(items.map((item) => item.category))];

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
          <GalleryGrid items={items} categories={categories} />
        </div>
      </section>
    </>
  );
}
