import type { PageContent } from "./types";

export const pageRegistry = [
  { slug: "anasayfa", label: "Anasayfa", path: "/" },
  { slug: "hakkimizda", label: "Hakkımızda", path: "/sayfa/hakkimizda" },
  { slug: "egitim-programi", label: "Eğitim Programı", path: "/egitim-programi" },
  { slug: "basarilarimiz", label: "Başarılarımız", path: "/basarilarimiz" },
  { slug: "galeri", label: "Galeri", path: "/galeri" },
  { slug: "iletisim", label: "İletişim", path: "/iletisim" },
] as const;

export type PageSlug = (typeof pageRegistry)[number]["slug"];

export const defaultHeroSlides = [
  {
    id: "slide-1",
    imageUrl: "/slider/slider1.png",
    title: "Verimli Ders Çalışma Teknikleri",
    subtitle:
      "Uzman eğitim kadrosu eşliğinde Verimli Ders Çalışma Teknikleri imge Kurs Merkezi'nde",
    link: "/iletisim",
    order: 1,
    enabled: true,
  },
  {
    id: "slide-2",
    imageUrl: "/slider/slider2.png",
    title: "Yeni Dönem Kayıtları Devam Ediyor",
    subtitle:
      "Sıcak aile ortamı ve butik eğitimin adresi İmge Kurs Merkezi'nde kayıtlar devam ediyor",
    link: "/iletisim",
    order: 2,
    enabled: true,
  },
  {
    id: "slide-3",
    imageUrl: "/slider/slider3.png",
    title: "Uzman Eğitim Kadrosu imge'de",
    subtitle: "Alanlarında uzman eğitim kadrosuyla imge Kurs Merkezi",
    link: "/sayfa/hakkimizda",
    order: 3,
    enabled: true,
  },
  {
    id: "slide-4",
    imageUrl: "/slider/slider4.png",
    title: "Kişiye Özel Butik Eğitim",
    subtitle: "Masabaşı butik eğitim ve sıcak aile ortamı",
    link: "/egitim-programi",
    order: 4,
    enabled: true,
  },
  {
    id: "slide-5",
    imageUrl: "/slider/slider5.png",
    title: "Maksimum 8-10 Kişilik Sınıflarda Eğitim İmkanı",
    subtitle:
      "imge Kurs Merkezi'nde maksimum 8-10 kişilik sınıflarda butik eğitim imkanı sizleri bekliyor",
    link: "/egitim-programi",
    order: 5,
    enabled: true,
  },
];

export function createDefaultPage(slug: PageSlug): PageContent {
  const entry = pageRegistry.find((p) => p.slug === slug)!;
  const base: PageContent = {
    id: slug,
    slug,
    title: entry.label,
    sections: [],
    updatedAt: new Date().toISOString(),
  };

  switch (slug) {
    case "anasayfa":
      return {
        ...base,
        heroSlides: defaultHeroSlides,
      };
    case "hakkimizda":
      return {
        ...base,
        heroTitle: "Geleceğe Güvenle Hazırlıyoruz",
        heroSubtitle:
          "Öğrenci odaklı, modern ve butik eğitim anlayışımızla Bahçelievler'in güvenilir eğitim merkezi.",
        sections: [
          {
            id: "who-we-are",
            type: "text-image",
            title: "Biz Kimiz?",
            content:
              "Bahçelievler İmge VIP Kurs Merkezi, 15 yılı aşkın tecrübesiyle öğrencilerini en prestijli üniversitelere ve liselerine hazırlayan köklü bir eğitim kurumudur. VIP sınıf konseptimizle her öğrenciye birebir ilgi gösteriyor, akademik başarıyı kişisel gelişimle birleştiriyoruz.\n\nModern sınıflarımız, uzman eğitim kadromuz ve kişiselleştirilmiş takip sistemimizle öğrencilerimizin potansiyelini en üst düzeye çıkarıyoruz.",
            imageUrl:
              "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
          },
          {
            id: "mission-vision",
            type: "mission-vision",
            items: [
              {
                title: "Misyonumuz",
                description:
                  "Her öğrencinin bireysel potansiyelini keşfederek, akademik mükemmelliği destekleyen, güvenli ve ilham verici bir öğrenme ortamı sunmak.",
                icon: "target",
              },
              {
                title: "Vizyonumuz",
                description:
                  "Türkiye'nin en saygın eğitim kurumlarından biri olarak, geleceğin liderlerini yetiştirmek.",
                icon: "eye",
              },
            ],
          },
          {
            id: "values",
            type: "values",
            title: "Değerlerimiz",
            items: [
              {
                title: "Birebir Takip",
                description: "Her öğrenci için kişisel gelişim planı.",
                icon: "user-search",
              },
              {
                title: "Uzman Kadro",
                description: "Alanında deneyimli eğitmenler.",
                icon: "graduation-cap",
              },
              {
                title: "Modern Sınıflar",
                description: "Teknoloji destekli eğitim ortamı.",
                icon: "monitor",
              },
              {
                title: "Başarı Odaklılık",
                description: "Hedefe yönelik çalışma sistemi.",
                icon: "medal",
              },
            ],
          },
        ],
      };
    case "egitim-programi":
      return {
        ...base,
        heroTitle: "Eğitim Programlarımız",
        heroSubtitle:
          "Her seviyeye uygun özel müfredat ve birebir takip ile öğrenci başarısını en üst düzeye çıkarıyoruz.",
      };
    case "basarilarimiz":
      return {
        ...base,
        heroTitle: "Başarı Yolculuğumuzda Sizinle Gurur Duyuyoruz",
        heroSubtitle:
          "Her yıl artan başarı grafiklerimizle geleceği birlikte inşa ediyoruz.",
      };
    case "galeri":
      return {
        ...base,
        heroTitle: "Galeri",
        heroSubtitle: "Eğitim ortamımızdan ve etkinliklerimizden kareler",
      };
    case "iletisim":
      return {
        ...base,
        heroTitle: "İletişim & Kayıt",
        heroSubtitle:
          "Eğitim yolculuğunuzda size eşlik etmek için buradayız. Sorularınız veya kayıt işlemleri için bizimle iletişime geçin.",
      };
    default:
      return base;
  }
}

export function getDefaultPages(): Record<string, PageContent> {
  return Object.fromEntries(
    pageRegistry.map((p) => [p.slug, createDefaultPage(p.slug)])
  );
}
