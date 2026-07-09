export const COURSE_PLACEHOLDER_IMAGE = "/images/placeholder-course.svg";

export function resolveCourseImage(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed ? trimmed : COURSE_PLACEHOLDER_IMAGE;
}

