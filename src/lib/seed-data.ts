import type {
  Course,
  GalleryItem,
  SiteSettings,
  SuccessStory,
  VideoLesson,
} from "./types";

export const defaultSiteSettings: SiteSettings = {
  siteName: "İMGE VIP",
  tagline: "",
  phone: "",
  email: "",
  address: "",
  workingHours: "",
  heroTitle: "",
  heroHighlight: "",
  heroSubtitle: "",
  heroImageUrl: "",
  stats: [],
};

export const defaultCourses: Course[] = [
  {
    id: "1",
    slug: "7-sinif",
    title: "7. Sınıf Hazırlık",
    category: "ORTAOKUL",
    description:
      "LGS temellerini sağlam atıyoruz. VIP sınıflarda birebir takip ve düzenli deneme sınavları.",
    imageUrl:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80",
    schedule: "Hafta içi 16:00 - 19:00",
    classSize: "Max 12 Kişi",
    isVip: true,
    tag: "VIP Sınıflar",
    order: 1,
    status: "active",
    features: [
      "LGS temel konu anlatımı",
      "Haftalık deneme sınavları",
      "Birebir rehberlik",
      "Veli bilgilendirme sistemi",
    ],
  },
  {
    id: "2",
    slug: "8-sinif",
    title: "8. Sınıf LGS Hazırlık",
    category: "LGS HAZIRLIK",
    description:
      "LGS'ye yoğun hazırlık programı. Deneme analizleri ve eksik konu tamamlama.",
    imageUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80",
    schedule: "Hafta içi 16:00 - 20:00",
    classSize: "Max 10 Kişi",
    isVip: true,
    tag: "VIP",
    order: 2,
    status: "active",
    features: [
      "LGS deneme kampı",
      "Soru çözüm saatleri",
      "Motivasyon seminerleri",
      "Online destek platformu",
    ],
  },
  {
    id: "3",
    slug: "9-sinif",
    title: "9. Sınıf",
    category: "LİSE",
    description:
      "Lise uyum programı ve erken YKS hazırlığı. Okul derslerine destek.",
    imageUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
    schedule: "Hafta içi 17:00 - 20:00",
    classSize: "Max 15 Kişi",
    order: 3,
    status: "active",
  },
  {
    id: "4",
    slug: "10-sinif",
    title: "10. Sınıf",
    category: "LİSE",
    description: "TYT temelleri ve okul başarısını artıran destek programı.",
    imageUrl:
      "https://images.unsplash.com/photo-1497633768975-a9d489788f46?w=800&q=80",
    schedule: "Hafta içi 17:00 - 21:00",
    classSize: "Max 15 Kişi",
    order: 4,
    status: "active",
  },
  {
    id: "5",
    slug: "11-siniflar",
    title: "11. Sınıflar",
    category: "ÜNİVERSİTEYE HAZIRLIK",
    description: "TYT-AYT hazırlığının temel aşaması. Konu tekrarı ve deneme.",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
    schedule: "Hafta içi 18:00 - 22:00",
    classSize: "Max 12 Kişi",
    order: 5,
    status: "active",
  },
  {
    id: "6",
    slug: "tyt-ayt",
    title: "TYT - AYT Hazırlık",
    category: "ÜNİVERSİTEYE HAZIRLIK",
    description:
      "Yoğunlaştırılmış YKS hazırlık programı. Koçluk ve birebir takip sistemi.",
    imageUrl:
      "https://images.unsplash.com/photo-1516979187456-41a8db1a0b0?w=800&q=80",
    schedule: "Hafta içi + Hafta sonu",
    classSize: "Max 10 Kişi",
    tag: "Yoğunlaştırılmış",
    order: 6,
    status: "active",
    features: [
      "TYT ve AYT tam müfredat",
      "Haftalık 2 deneme sınavı",
      "Kişisel çalışma planı",
      "Üniversite tercih danışmanlığı",
      "Psikolojik destek",
    ],
    scheduleTable: [
      { day: "Pazartesi", time: "09:00 - 12:00", content: "Matematik" },
      { day: "Salı", time: "09:00 - 12:00", content: "Fizik / Kimya" },
      { day: "Çarşamba", time: "09:00 - 12:00", content: "Türkçe / Edebiyat" },
      { day: "Perşembe", time: "09:00 - 12:00", content: "Biyoloji / Coğrafya" },
      { day: "Cuma", time: "09:00 - 12:00", content: "Deneme + Analiz" },
    ],
  },
  {
    id: "7",
    slug: "tyt-ayt-mezun-grubu",
    title: "TYT-AYT Mezun Grubu",
    category: "MEZUN",
    description:
      "Mezun öğrenciler için tam gün yoğun hazırlık programı.",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
    schedule: "Tam gün program",
    classSize: "Max 8 Kişi",
    tag: "Yoğunlaştırılmış",
    isVip: true,
    order: 7,
    status: "active",
  },
];

export const defaultSuccessStories: SuccessStory[] = [];
export const defaultGallery: GalleryItem[] = [];
export const defaultVideoLessons: VideoLesson[] = [];

export const educationMenu = [
  { label: "7. Sınıf", href: "/egitim-detay/7-sinif" },
  { label: "8. Sınıf", href: "/egitim-detay/8-sinif" },
  { label: "9. Sınıf", href: "/egitim-detay/9-sinif" },
  { label: "10. Sınıf", href: "/egitim-detay/10-sinif" },
  { label: "TYT-AYT", href: "/egitim-detay/tyt-ayt" },
  { label: "TYT-AYT Mezun Grubu", href: "/egitim-detay/tyt-ayt-mezun-grubu" },
  { label: "11. Sınıflar", href: "/egitim-detay/11-siniflar" },
];

export const mainNav: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/sayfa/hakkimizda" },
  { label: "Eğitimlerimiz", href: "/egitim-programi", children: educationMenu },
  { label: "Başarılarımız", href: "/basarilarimiz" },
  { label: "Galeri", href: "/galeri" },
  { label: "Eğitim Programı", href: "/egitim-programi" },
  { label: "İletişim", href: "/iletisim" },
];
