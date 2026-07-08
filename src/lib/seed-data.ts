import type {
  Course,
  GalleryItem,
  SiteSettings,
  SuccessStory,
  VideoLesson,
} from "./types";
import { getDefaultPages } from "./pages";

export const defaultSiteSettings: SiteSettings = {
  siteName: "İMGE VIP",
  tagline: "Geleceği aydınlatan eğitim vizyonu",
  phone: "+90 (212) 555 01 23",
  phoneSecondary: "+90 (532) 555 01 24",
  email: "bilgi@imgekurs.com.tr",
  address: "Bahçelievler Mah. Eğitim Cd. No:12 Bahçelievler / İstanbul",
  workingHours: "Pzt - Cmt: 09:00 - 19:00",
  workingHoursWeekend: "Pazar: Kapalı",
  heroTitle: "Başarıya Giden",
  heroHighlight: "Yol",
  heroSubtitle:
    "Uzman eğitim kadromuzla geleceğinizi şekillendiriyoruz. Yeni dönem VIP kayıtlarımız başladı.",
  heroImageUrl:
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80",
  stats: [
    { value: "%95", label: "Üniversiteye Yerleşme" },
    { value: "15+", label: "Yıllık Tecrübe" },
    { value: "50+", label: "Uzman Eğitmen" },
    { value: "2500+", label: "Başarılı Öğrenci" },
  ],
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

export const defaultSuccessStories: SuccessStory[] = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    rank: "YKS Sayısal Türkiye 882.si",
    university: "Boğaziçi Üniversitesi",
    department: "Bilgisayar Mühendisliği",
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    quote:
      "İmge VIP'te aldığım birebir destek sayesinde hedeflediğim üniversiteye yerleştim.",
    order: 1,
  },
  {
    id: "2",
    name: "Zeynep Kaya",
    rank: "YKS Eşit Ağırlık İstanbul 45.si",
    university: "Galatasaray Üniversitesi",
    department: "Hukuk",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    quote: "Disiplinli çalışma ortamı ve uzman kadro fark yarattı.",
    order: 2,
  },
  {
    id: "3",
    name: "Mehmet Demir",
    rank: "LGS İstanbul 120.si",
    university: "İstanbul Erkek Lisesi",
    department: "",
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    quote: "LGS sürecinde her adımda yanımda oldular.",
    order: 3,
  },
];

export const defaultGallery: GalleryItem[] = [
  {
    id: "1",
    title: "Modern Sınıflarımız",
    imageUrl:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80",
    category: "Sınıflar",
    order: 1,
  },
  {
    id: "2",
    title: "Kütüphane",
    imageUrl:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
    category: "Tesisler",
    order: 2,
  },
  {
    id: "3",
    title: "Grup Çalışması",
    imageUrl:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80",
    category: "Etkinlikler",
    order: 3,
  },
  {
    id: "4",
    title: "Mezuniyet Töreni",
    imageUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    category: "Etkinlikler",
    order: 4,
  },
  {
    id: "5",
    title: "Deneme Sınavı",
    imageUrl:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
    category: "Sınavlar",
    order: 5,
  },
  {
    id: "6",
    title: "Rehberlik",
    imageUrl:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&q=80",
    category: "Rehberlik",
    order: 6,
  },
];

export const defaultVideoLessons: VideoLesson[] = [
  {
    id: "1",
    slug: "5-sinif-dersler",
    title: "5. Sınıf Dersler",
    grade: "5. Sınıf",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80",
    description: "5. sınıf müfredatına uygun ders videoları.",
    order: 1,
  },
  {
    id: "2",
    slug: "6-sinif-dersler",
    title: "6. Sınıf Dersler",
    grade: "6. Sınıf",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80",
    description: "6. sınıf konu anlatım videoları.",
    order: 2,
  },
  {
    id: "3",
    slug: "7-sinif-dersler",
    title: "7. Sınıf Dersler",
    grade: "7. Sınıf",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
    description: "7. sınıf ders videoları ve tekrar içerikleri.",
    order: 3,
  },
  {
    id: "4",
    slug: "8-sinif-dersler",
    title: "8. Sınıf Dersler",
    grade: "8. Sınıf",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1497633768975-a9d489788f46?w=600&q=80",
    description: "LGS hazırlık ders videoları.",
    order: 4,
  },
];

export const defaultPages = getDefaultPages();

export const educationMenu = [
  { label: "7. Sınıf", href: "/egitim-detay/7-sinif" },
  { label: "8. Sınıf", href: "/egitim-detay/8-sinif" },
  { label: "9. Sınıf", href: "/egitim-detay/9-sinif" },
  { label: "10. Sınıf", href: "/egitim-detay/10-sinif" },
  { label: "TYT-AYT", href: "/egitim-detay/tyt-ayt" },
  { label: "TYT-AYT Mezun Grubu", href: "/egitim-detay/tyt-ayt-mezun-grubu" },
  { label: "11. Sınıflar", href: "/egitim-detay/11-siniflar" },
];

export const videoMenu = [
  { label: "5. Sınıf Dersler", href: "/egitim/5-sinif-dersler" },
  { label: "6. Sınıf Dersler", href: "/egitim/6-sinif-dersler" },
  { label: "7. Sınıf Dersler", href: "/egitim/7-sinif-dersler" },
  { label: "8. Sınıf Dersler", href: "/egitim/8-sinif-dersler" },
];

export const mainNav = [
  { label: "Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/sayfa/hakkimizda" },
  { label: "Eğitimlerimiz", href: "/egitim-programi", children: educationMenu },
  { label: "Başarılarımız", href: "/basarilarimiz" },
  { label: "Galeri", href: "/galeri" },
  { label: "Eğitim Videoları", href: "#", children: videoMenu },
  { label: "Eğitim Programı", href: "/egitim-programi" },
  { label: "İletişim", href: "/iletisim" },
];
