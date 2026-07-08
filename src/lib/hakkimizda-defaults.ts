import type { PageContent, PageSection } from "./types";

export const defaultHakkimizdaSections: PageSection[] = [
  {
    id: "who-we-are",
    type: "text-image",
    title: "Biz Kimiz?",
    content:
      "Bahçelievler İmge VIP Kurs Merkezi, 15 yılı aşkın tecrübesiyle öğrencilerini en prestijli üniversitelere ve liselerine hazırlayan köklü bir eğitim kurumudur. VIP sınıf konseptimizle her öğrenciye birebir ilgi gösteriyor, akademik başarıyı kişisel gelişimle birleştiriyoruz.\n\nModern sınıflarımız, uzman eğitim kadromuz ve kişiselleştirilmiş takip sistemimizle öğrencilerimizin potansiyelini en üst düzeye çıkarıyoruz.",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    theme: "light",
  },
  {
    id: "mission-vision",
    type: "mission-vision",
    items: [
      {
        title: "Misyonumuz",
        description:
          "Her öğrencinin bireysel potansiyelini keşfetmesine ve en yüksek akademik başarıya ulaşmasına rehberlik etmek.",
        icon: "target",
      },
      {
        title: "Vizyonumuz",
        description:
          "Türkiye'nin en güvenilir ve başarılı VIP eğitim kurumu olarak öğrencilerimizin geleceğine ışık tutmak.",
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
        title: "Bireysel Takip",
        description: "Her öğrenciye özel gelişim planı ve düzenli veli görüşmeleri.",
        icon: "user-search",
      },
      {
        title: "Akademik Mükemmellik",
        description: "Güncel müfredat, deneme sınavları ve konu tekrar programları.",
        icon: "graduation-cap",
      },
      {
        title: "Modern Eğitim",
        description: "Teknoloji destekli sınıflar ve interaktif öğrenme ortamı.",
        icon: "monitor",
      },
      {
        title: "Başarı Odaklılık",
        description: "Hedef belirleme, motivasyon ve sürekli performans analizi.",
        icon: "medal",
      },
    ],
  },
  {
    id: "expert-staff",
    type: "text-image",
    title: "Uzman Eğitim Kadromuz",
    content:
      "Alanında uzman, deneyimli ve öğrenci odaklı eğitmenlerimizle her öğrencinin potansiyelini en üst düzeye çıkarıyoruz.",
    imageUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80",
    buttonText: "Tüm Kadroyu İncele →",
    buttonLink: "/iletisim",
    theme: "dark",
  },
];

export const hakkimizdaSectionLabels: Record<string, string> = {
  "who-we-are": "Biz Kimiz?",
  "mission-vision": "Misyon & Vizyon",
  values: "Değerlerimiz",
  "expert-staff": "Uzman Eğitim Kadromuz",
};

export function mergeHakkimizdaSections(sections: PageSection[]): PageSection[] {
  const byId = new Map(sections.map((section) => [section.id, section]));
  return defaultHakkimizdaSections.map(
    (section) => byId.get(section.id) ?? section
  );
}

export function normalizeHakkimizdaPage(page: PageContent): PageContent {
  return {
    ...page,
    sections:
      page.sections.length > 0
        ? mergeHakkimizdaSections(page.sections)
        : defaultHakkimizdaSections,
  };
}
