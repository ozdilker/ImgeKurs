import type { Student } from "./types";

export function studentToFirestore(
  student: Student,
  now = new Date().toISOString()
): Record<string, unknown> {
  return {
    fullName: student.fullName.trim(),
    gradeLevel: student.gradeLevel.trim(),
    parentName: student.parentName.trim(),
    parentPhone: formatPhoneValue(student.parentPhone),
    school: student.school?.trim() || null,
    phone: student.phone ? formatPhoneValue(student.phone) : null,
    email: student.email?.trim() || null,
    parentEmail: student.parentEmail?.trim() || null,
    classSectionId: student.classSectionId || null,
    status: student.status,
    registrationId: student.registrationId || null,
    notes: student.notes?.trim() || null,
    createdAt: student.createdAt || now,
    updatedAt: now,
  };
}

export function formatPhoneValue(value: string | number): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    return String(Math.trunc(value));
  }
  return String(value ?? "").trim();
}
