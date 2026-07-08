import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  addDoc,
  type Firestore,
} from "firebase/firestore";
import { getClientDb, isFirebaseConfigured } from "./client";
import type {
  Course,
  GalleryItem,
  PageContent,
  Registration,
  SiteSettings,
  SuccessStory,
  VideoLesson,
} from "../types";
import {
  defaultCourses,
  defaultGallery,
  defaultSiteSettings,
  defaultSuccessStories,
  defaultVideoLessons,
} from "../seed-data";
import { getDefaultPages } from "../pages";

function db(): Firestore | null {
  return getClientDb();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return defaultSiteSettings;
  try {
    const snap = await getDoc(doc(firestore, "settings", "site"));
    return snap.exists()
      ? ({ ...defaultSiteSettings, ...snap.data() } as SiteSettings)
      : defaultSiteSettings;
  } catch {
    return defaultSiteSettings;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");

  const payload = { ...settings };

  if (payload.logoUrl?.startsWith("data:")) {
    throw new Error(
      "Logo base64 olarak kaydedilemez. Lütfen 'Yükle' butonunu kullanın veya bir görsel URL'si girin."
    );
  }

  if (payload.logoUrl === "") {
    payload.logoUrl = undefined;
  }

  await setDoc(doc(firestore, "settings", "site"), payload, { merge: true });
}

export async function getCourses(): Promise<Course[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return defaultCourses;
  try {
    const q = query(collection(firestore, "courses"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return defaultCourses;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
  } catch {
    return defaultCourses;
  }
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const courses = await getCourses();
  return courses.find((c) => c.slug === slug) ?? null;
}

export async function saveCourse(course: Course): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await setDoc(doc(firestore, "courses", course.id), course);
}

export async function deleteCourse(id: string): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await deleteDoc(doc(firestore, "courses", id));
}

export async function getSuccessStories(): Promise<SuccessStory[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return defaultSuccessStories;
  try {
    const q = query(
      collection(firestore, "successStories"),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    if (snap.empty) return defaultSuccessStories;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SuccessStory));
  } catch {
    return defaultSuccessStories;
  }
}

export async function saveSuccessStory(story: SuccessStory): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await setDoc(doc(firestore, "successStories", story.id), story);
}

export async function deleteSuccessStory(id: string): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await deleteDoc(doc(firestore, "successStories", id));
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return defaultGallery;
  try {
    const q = query(collection(firestore, "gallery"), orderBy("order", "asc"));
    const snap = await getDocs(q);
    if (snap.empty) return defaultGallery;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
  } catch {
    return defaultGallery;
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await setDoc(doc(firestore, "gallery", item.id), item);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await deleteDoc(doc(firestore, "gallery", id));
}

export async function getVideoLessons(): Promise<VideoLesson[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return defaultVideoLessons;
  try {
    const q = query(
      collection(firestore, "videoLessons"),
      orderBy("order", "asc")
    );
    const snap = await getDocs(q);
    if (snap.empty) return defaultVideoLessons;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VideoLesson));
  } catch {
    return defaultVideoLessons;
  }
}

export async function getVideoLessonBySlug(
  slug: string
): Promise<VideoLesson | null> {
  const lessons = await getVideoLessons();
  return lessons.find((l) => l.slug === slug) ?? null;
}

export async function saveVideoLesson(lesson: VideoLesson): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await setDoc(doc(firestore, "videoLessons", lesson.id), lesson);
}

export async function deleteVideoLesson(id: string): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await deleteDoc(doc(firestore, "videoLessons", id));
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const defaults = getDefaultPages();
  const fallback = defaults[slug] ?? null;
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return fallback;
  try {
    const snap = await getDoc(doc(firestore, "pages", slug));
    if (!snap.exists()) return fallback;
    const data = snap.data() as PageContent;
    return {
      ...fallback,
      ...data,
      sections: data.sections?.length ? data.sections : fallback?.sections ?? [],
      heroSlides: data.heroSlides?.length
        ? data.heroSlides
        : fallback?.heroSlides,
    };
  } catch {
    return fallback;
  }
}

export async function getAllPages(): Promise<PageContent[]> {
  const defaults = getDefaultPages();
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) {
    return Object.values(defaults);
  }
  try {
    const snap = await getDocs(collection(firestore, "pages"));
    const saved = Object.fromEntries(
      snap.docs.map((d) => [d.id, { id: d.id, ...d.data() } as PageContent])
    );
    return Object.keys(defaults).map((slug) => ({
      ...defaults[slug],
      ...saved[slug],
      sections: saved[slug]?.sections?.length
        ? saved[slug].sections
        : defaults[slug].sections,
      heroSlides: saved[slug]?.heroSlides?.length
        ? saved[slug].heroSlides
        : defaults[slug].heroSlides,
    }));
  } catch {
    return Object.values(defaults);
  }
}

export async function savePageContent(page: PageContent): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await setDoc(
    doc(firestore, "pages", page.slug),
    { ...page, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

export async function submitRegistration(
  data: Omit<Registration, "id" | "createdAt" | "status">
): Promise<string> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) {
    console.log("Registration (demo mode):", data);
    return "demo-" + Date.now();
  }
  const ref = await addDoc(collection(firestore, "registrations"), {
    ...data,
    status: "new",
    createdAt: new Date().toISOString(),
  });
  return ref.id;
}

export async function getRegistrations(): Promise<Registration[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return [];
  try {
    const q = query(
      collection(firestore, "registrations"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Registration));
  } catch {
    return [];
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: Registration["status"]
): Promise<void> {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  await setDoc(doc(firestore, "registrations", id), { status }, { merge: true });
}

export async function uploadImagePlaceholder(file: File): Promise<string> {
  const { uploadImage } = await import("./storage");
  return uploadImage(file, "uploads");
}
