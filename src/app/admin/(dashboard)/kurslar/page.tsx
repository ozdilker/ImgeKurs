"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { deleteCourse, getCourses, seedDefaultCoursesIfEmpty } from "@/lib/firebase/firestore";
import { revalidateProgramPages } from "@/app/actions/revalidate";
import type { Course } from "@/lib/types";
import { Pencil, Plus, Trash2 } from "lucide-react";

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        await seedDefaultCoursesIfEmpty();
        const data = await getCourses();
        setCourses(data.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      } catch {
        setError("Programlar yüklenemedi. Firebase bağlantısını kontrol edin.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Bu programı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      await revalidateProgramPages();
    } catch {
      alert("Silme işlemi başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Eğitim Programları"
        subtitle="Yeni program ekleyin, VIP durumunu belirleyin ve mevcut programları düzenleyin."
      />

      <div className="mb-6 flex justify-end">
        <Link href="/admin/kurslar/yeni">
          <Button size="sm">
            <Plus className="h-4 w-4" /> Yeni Program Ekle
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-slate-text">Programlar yükleniyor...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-primary">{error}</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-primary">Henüz program yok</p>
          <p className="mt-2 text-sm text-slate-text">
            İlk eğitim programınızı eklemek için yukarıdaki butonu kullanın.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 shadow-card ${
                course.isVip ? "ring-2 ring-gold" : ""
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-primary">{course.title}</h3>
                  {course.isVip && (
                    <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-primary">
                      VIP
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      course.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-surface-gray text-slate-text"
                    }`}
                  >
                    {course.status === "active" ? "Aktif" : "Taslak"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-text">
                  {course.category} · /egitim-detay/{course.slug} · Sıra:{" "}
                  {course.order ?? 0}
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
      )}
    </>
  );
}
