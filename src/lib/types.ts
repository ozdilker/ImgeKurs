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

export type HeroSlide = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  link?: string;
  order: number;
  enabled: boolean;
};

export type PageContent = {
  id: string;
  slug: string;
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  heroSlides?: HeroSlide[];
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
  logoUrl?: string;
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
  source?: "contact" | "pre-registration";
  convertedStudentId?: string;
  createdAt: string;
  status: "new" | "contacted" | "enrolled";
};

export type Student = {
  id: string;
  fullName: string;
  gradeLevel: string;
  school?: string;
  phone?: string;
  email?: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  classSectionId?: string;
  status: "active" | "inactive" | "graduated" | "withdrawn";
  registrationId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClassSection = {
  id: string;
  name: string;
  gradeLevel: string;
  programId?: string;
  capacity: number;
  schedule?: string;
  academicYear: string;
  status: "open" | "full" | "closed";
  order: number;
  createdAt: string;
};

export type AdminUser = {
  uid: string;
  email: string;
  displayName?: string;
};
