"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { deleteCourse, getCourses } from "@/lib/firebase/firestore";
import type { Course } from "@/lib/types";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu kursu silmek istediğinize emin misiniz?")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Silme işlemi başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Kurs Yönetimi"
        subtitle="Eğitim programlarını düzenleyin."
      />

      <div className="mb-6 flex justify-end">
        <Link href="/admin/kurslar/yeni">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Yeni Kurs
          </Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-card"
          >
            <div>
              <h3 className="font-semibold text-primary">{course.title}</h3>
              <p className="text-sm text-slate-text">
                {course.category} · {course.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/kurslar/${course.id}`}
                className="rounded-lg p-2 text-outline hover:bg-surface-gray"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => handleDelete(course.id)}
                className="rounded-lg p-2 text-outline hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
