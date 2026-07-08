export type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  schedule?: string;
  classSize?: string;
  isVip?: boolean;
  tag?: string;
  features?: string[];
  scheduleTable?: { day: string; time: string; content: string }[];
  order: number;
  status: "active" | "draft";
};

export type SuccessStory = {
  id: string;
  name: string;
  rank: string;
  university: string;
  department: string;
  imageUrl: string;
  quote: string;
  order: number;
};

export type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  order: number;
};

export type VideoLesson = {
  id: string;
  slug: string;
  title: string;
  grade: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  order: number;
};

export type PageContent = {
  id: string;
  slug: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  sections: PageSection[];
  updatedAt: string;
};

export type PageSection = {
  id: string;
  type:
    | "text-image"
    | "cards"
    | "stats"
    | "values"
    | "mission-vision"
    | "cta"
    | "html";
  title?: string;
  content?: string;
  imageUrl?: string;
  items?: SectionItem[];
};

export type SectionItem = {
  title: string;
  description: string;
  icon?: string;
  value?: string;
  label?: string;
  imageUrl?: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  address: string;
  workingHours: string;
  workingHoursWeekend?: string;
  mapEmbedUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  stats: { value: string; label: string }[];
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImageUrl: string;
};

export type Registration = {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email?: string;
  grade: string;
  school?: string;
  notes?: string;
  kvkkAccepted: boolean;
  createdAt: string;
  status: "new" | "contacted" | "enrolled";
};

export type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
};
