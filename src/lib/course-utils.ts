import type { Course } from "./types";

export const COURSE_PLACEHOLDER_IMAGE = "/images/placeholder-course.svg";

function parseCourseOrder(value: unknown, fallback = 1): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) return parsed;
  }
  return fallback;
}

export function isValidCourse(course: Pick<Course, "title" | "slug">): boolean {
  return Boolean(course.title.trim() && course.slug.trim());
}

export function normalizeCourseDoc(
  id: string,
  data: Record<string, unknown>
): Course {
  return {
    id,
    slug: String(data.slug ?? ""),
    title: String(data.title ?? ""),
    category: String(data.category ?? ""),
    description: String(data.description ?? ""),
    imageUrl: String(data.imageUrl ?? ""),
    schedule: data.schedule ? String(data.schedule) : undefined,
    classSize: data.classSize ? String(data.classSize) : undefined,
    tag: data.tag ? String(data.tag) : undefined,
    isVip: data.isVip === true,
    order: parseCourseOrder(data.order),
    status: data.status === "draft" ? "draft" : "active",
    features: Array.isArray(data.features)
      ? data.features.map(String)
      : undefined,
    scheduleTable: Array.isArray(data.scheduleTable)
      ? (data.scheduleTable as Course["scheduleTable"])
      : undefined,
  };
}

const ALLOWED_IMAGE_HOSTNAMES = new Set([
  "firebasestorage.googleapis.com",
  "images.unsplash.com",
]);

export function resolveCourseImage(url?: string | null): string {
  const trimmed = url?.trim();
  if (!trimmed) return COURSE_PLACEHOLDER_IMAGE;

  // Avoid Next/Image runtime errors for non-allowed domains.
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const hostname = new URL(trimmed).hostname;
    if (!ALLOWED_IMAGE_HOSTNAMES.has(hostname)) return COURSE_PLACEHOLDER_IMAGE;
  } catch {
    return COURSE_PLACEHOLDER_IMAGE;
  }

  return trimmed;
}

