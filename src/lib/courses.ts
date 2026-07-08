import type { Course } from "./types";
import { educationMenu, mainNav } from "./seed-data";

export function slugifyCourseTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function coursesToMenuItems(courses: Course[]) {
  return courses
    .filter((course) => course.status === "active")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((course) => ({
      label: course.title,
      href: `/egitim-detay/${course.slug}`,
    }));
}

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export function buildMainNav(
  courseMenuItems: { label: string; href: string }[]
): NavItem[] {
  const children = courseMenuItems.length > 0 ? courseMenuItems : educationMenu;

  return mainNav.map((item) =>
    item.label === "Eğitimlerimiz" ? { ...item, children } : item
  );
}

export function getNextCourseOrder(courses: Course[]): number {
  return courses.reduce((max, course) => Math.max(max, course.order ?? 0), 0) + 1;
}
