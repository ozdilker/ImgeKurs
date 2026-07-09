export const COURSE_PLACEHOLDER_IMAGE = "/images/placeholder-course.svg";

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

