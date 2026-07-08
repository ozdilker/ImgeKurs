import type { Student, SuccessStory } from "./types";
import { resolveSuccessStoryImage } from "./success-story-utils";

export const studentGururStoryId = (studentId: string) =>
  `student-gurur-${studentId}`;

export function shouldShowStudentOnGururTable(student: Student): boolean {
  if (!student.showOnGururTable) return false;
  return Boolean(
    student.fullName.trim() &&
      student.university?.trim() &&
      student.department?.trim()
  );
}

export function studentToGururStory(
  student: Student,
  order: number
): SuccessStory {
  return {
    id: studentGururStoryId(student.id),
    name: student.fullName.trim(),
    rank: student.rank?.trim() ?? "",
    university: student.university!.trim(),
    department: student.department!.trim(),
    imageUrl: resolveSuccessStoryImage(student.imageUrl),
    quote: student.gururQuote?.trim() ?? "",
    order,
  };
}
