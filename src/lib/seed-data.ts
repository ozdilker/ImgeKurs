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

export const defaultCourses: Course[] = [];
export const defaultSuccessStories: SuccessStory[] = [];
export const defaultGallery: GalleryItem[] = [];
export const defaultVideoLessons: VideoLesson[] = [];

export const mainNav: {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}[] = [
  { label: "Anasayfa", href: "/" },
  { label: "Hakkımızda", href: "/sayfa/hakkimizda" },
  { label: "Eğitimlerimiz", href: "/egitim-programi" },
  { label: "Başarılarımız", href: "/basarilarimiz" },
  { label: "Galeri", href: "/galeri" },
  { label: "Eğitim Programı", href: "/egitim-programi" },
  { label: "İletişim", href: "/iletisim" },
];
