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
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { getClientDb, isFirebaseConfigured } from "./client";
import type {
  ClassSection,
  Course,
  GalleryItem,
  PageContent,
  Registration,
  SiteSettings,
  Student,
  SuccessStory,
  VideoLesson,
} from "../types";
import { defaultCourses, defaultSiteSettings } from "../seed-data";
import { getDefaultPages } from "../pages";

function db(): Firestore | null {
  return getClientDb();
}

function requireDb(): Firestore {
  const firestore = db();
  if (!firestore) throw new Error("Firebase yapılandırılmamış");
  return firestore;
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
  const firestore = requireDb();
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

async function fetchOrdered<T>(
  collectionName: string,
  orderField: string
): Promise<T[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return [];
  try {
    const q = query(
      collection(firestore, collectionName),
      orderBy(orderField, "asc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch {
    return [];
  }
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
  await setDoc(doc(requireDb(), "courses", course.id), course);
}

export async function deleteCourse(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "courses", id));
}

export async function getSuccessStories(): Promise<SuccessStory[]> {
  return fetchOrdered<SuccessStory>("successStories", "order");
}

export async function saveSuccessStory(story: SuccessStory): Promise<void> {
  await setDoc(doc(requireDb(), "successStories", story.id), story);
}

export async function deleteSuccessStory(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "successStories", id));
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  return fetchOrdered<GalleryItem>("gallery", "order");
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  await setDoc(doc(requireDb(), "gallery", item.id), item);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "gallery", id));
}

export async function getVideoLessons(): Promise<VideoLesson[]> {
  return fetchOrdered<VideoLesson>("videoLessons", "order");
}

export async function getVideoLessonBySlug(
  slug: string
): Promise<VideoLesson | null> {
  const lessons = await getVideoLessons();
  return lessons.find((l) => l.slug === slug) ?? null;
}

export async function saveVideoLesson(lesson: VideoLesson): Promise<void> {
  await setDoc(doc(requireDb(), "videoLessons", lesson.id), lesson);
}

export async function deleteVideoLesson(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "videoLessons", id));
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
  await setDoc(
    doc(requireDb(), "pages", page.slug),
    { ...page, updatedAt: new Date().toISOString() },
    { merge: true }
  );
}

export async function submitRegistration(
  data: Omit<Registration, "id" | "createdAt" | "status">
): Promise<string> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) {
    throw new Error("Firebase yapılandırılmamış");
  }

  const payload = {
    studentName: data.studentName.trim(),
    parentName: data.parentName.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || null,
    grade: data.grade.trim(),
    school: data.school?.trim() || null,
    notes: data.notes?.trim() || null,
    kvkkAccepted: data.kvkkAccepted,
    source: data.source ?? "contact",
    status: "new" as const,
    createdAt: new Date().toISOString(),
  };

  const ref = await addDoc(collection(firestore, "registrations"), payload);
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
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        email: data.email ?? undefined,
        school: data.school ?? undefined,
        notes: data.notes ?? undefined,
        source: data.source ?? "contact",
        convertedStudentId: data.convertedStudentId ?? undefined,
      } as Registration;
    });
  } catch {
    return [];
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: Registration["status"]
): Promise<void> {
  await setDoc(doc(requireDb(), "registrations", id), { status }, { merge: true });
}

export async function deleteRegistration(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "registrations", id));
}

function normalizeStudent(data: Record<string, unknown>, id: string): Student {
  return {
    id,
    fullName: String(data.fullName ?? ""),
    gradeLevel: String(data.gradeLevel ?? ""),
    school: data.school ? String(data.school) : undefined,
    phone: data.phone ? String(data.phone) : undefined,
    email: data.email ? String(data.email) : undefined,
    parentName: String(data.parentName ?? ""),
    parentPhone: String(data.parentPhone ?? ""),
    parentEmail: data.parentEmail ? String(data.parentEmail) : undefined,
    classSectionId: data.classSectionId ? String(data.classSectionId) : undefined,
    status: (data.status as Student["status"]) ?? "active",
    registrationId: data.registrationId ? String(data.registrationId) : undefined,
    notes: data.notes ? String(data.notes) : undefined,
    createdAt: String(data.createdAt ?? new Date().toISOString()),
    updatedAt: String(data.updatedAt ?? new Date().toISOString()),
  };
}

export async function getStudents(): Promise<Student[]> {
  const firestore = db();
  if (!firestore || !isFirebaseConfigured()) return [];
  try {
    const q = query(collection(firestore, "students"), orderBy("fullName", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => normalizeStudent(d.data(), d.id));
  } catch {
    return [];
  }
}

export async function saveStudent(student: Student): Promise<void> {
  const now = new Date().toISOString();
  const payload = {
    ...student,
    fullName: student.fullName.trim(),
    gradeLevel: student.gradeLevel.trim(),
    parentName: student.parentName.trim(),
    parentPhone: student.parentPhone.trim(),
    updatedAt: now,
    createdAt: student.createdAt || now,
  };
  await setDoc(doc(requireDb(), "students", student.id), payload);
}

export async function deleteStudent(id: string): Promise<void> {
  await deleteDoc(doc(requireDb(), "students", id));
}

export async function assignStudentToClass(
  studentId: string,
  classSectionId: string | null
): Promise<void> {
  await setDoc(
    doc(requireDb(), "students", studentId),
    {
      classSectionId: classSectionId || null,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function bulkSaveStudents(students: Student[]): Promise<number> {
  const firestore = requireDb();
  const now = new Date().toISOString();
  const chunkSize = 400;

  for (let i = 0; i < students.length; i += chunkSize) {
    const batch = writeBatch(firestore);
    const chunk = students.slice(i, i + chunkSize);

    chunk.forEach((student) => {
      const ref = doc(firestore, "students", student.id);
      batch.set(ref, {
        ...student,
        fullName: student.fullName.trim(),
        gradeLevel: student.gradeLevel.trim(),
        parentName: student.parentName.trim(),
        parentPhone: student.parentPhone.trim(),
        createdAt: student.createdAt || now,
        updatedAt: now,
      });
    });

    await batch.commit();
  }

  return students.length;
}

export async function createStudentFromRegistration(
  registration: Registration
): Promise<string> {
  const id = `student-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();
  const student: Student = {
    id,
    fullName: registration.studentName,
    gradeLevel: registration.grade,
    school: registration.school,
    phone: registration.phone,
    email: registration.email,
    parentName: registration.parentName,
    parentPhone: registration.phone,
    parentEmail: registration.email,
    status: "active",
    registrationId: registration.id,
    notes: registration.notes,
    createdAt: now,
    updatedAt: now,
  };

  await saveStudent(student);
  await setDoc(
    doc(requireDb(), "registrations", registration.id),
    { status: "enrolled", convertedStudentId: id },
    { merge: true }
  );
  return id;
}

export async function getClassSections(): Promise<ClassSection[]> {
  return fetchOrdered<ClassSection>("classSections", "order");
}

export async function saveClassSection(section: ClassSection): Promise<void> {
  await setDoc(doc(requireDb(), "classSections", section.id), section);
}

export async function deleteClassSection(id: string): Promise<void> {
  const firestore = requireDb();
  const students = await getStudents();
  const assigned = students.filter((s) => s.classSectionId === id);
  if (assigned.length > 0) {
    throw new Error(
      `Bu sınıfa atanmış ${assigned.length} öğrenci var. Önce öğrencileri başka sınıfa taşıyın.`
    );
  }
  await deleteDoc(doc(firestore, "classSections", id));
}

export async function getStudentsByClassSection(
  classSectionId: string
): Promise<Student[]> {
  const students = await getStudents();
  return students.filter((s) => s.classSectionId === classSectionId);
}

export async function uploadImagePlaceholder(file: File): Promise<string> {
  const { uploadImage } = await import("./storage");
  return uploadImage(file, "uploads");
}
