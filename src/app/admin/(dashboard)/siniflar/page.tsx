"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import {
  deleteClassSection,
  getClassSections,
  getStudents,
  saveClassSection,
} from "@/lib/firebase/firestore";
import { GRADE_LEVELS } from "@/lib/grades";
import type { ClassSection } from "@/lib/types";
import { Plus, Trash2, Users } from "lucide-react";

const currentYear = new Date().getFullYear();
const defaultAcademicYear = `${currentYear}-${currentYear + 1}`;

const emptyForm = {
  name: "",
  gradeLevel: "",
  capacity: "12",
  schedule: "",
  academicYear: defaultAcademicYear,
  status: "open" as ClassSection["status"],
  isVip: false,
};

export default function ClassSectionsAdminPage() {
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [students, setStudents] = useState<{ classSectionId?: string }[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const [sectionData, studentData] = await Promise.all([
      getClassSections(),
      getStudents(),
    ]);
    setSections(sectionData);
    setStudents(studentData);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const studentCountBySection = useMemo(() => {
    const counts = new Map<string, number>();
    students.forEach((student) => {
      if (!student.classSectionId) return;
      counts.set(
        student.classSectionId,
        (counts.get(student.classSectionId) ?? 0) + 1
      );
    });
    return counts;
  }, [students]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    const section: ClassSection = {
      id: editingId ?? `class-${Date.now()}`,
      name: form.name.trim(),
      gradeLevel: form.gradeLevel,
      capacity: Number(form.capacity) || 12,
      schedule: form.schedule.trim() || undefined,
      academicYear: form.academicYear.trim() || defaultAcademicYear,
      status: form.status,
      isVip: form.isVip,
      order: editingId
        ? sections.find((s) => s.id === editingId)?.order ?? sections.length + 1
        : sections.length + 1,
      createdAt: editingId
        ? sections.find((s) => s.id === editingId)?.createdAt ?? now
        : now,
    };

    try {
      await saveClassSection(section);
      setSections((prev) => {
        if (editingId) {
          return prev
            .map((s) => (s.id === editingId ? section : s))
            .sort((a, b) => a.order - b.order);
        }
        return [...prev, section].sort((a, b) => a.order - b.order);
      });
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      alert("Sınıf kaydedilemedi.");
    }
  }

  function startEdit(section: ClassSection) {
    setEditingId(section.id);
    setForm({
      name: section.name,
      gradeLevel: section.gradeLevel,
      capacity: String(section.capacity),
      schedule: section.schedule ?? "",
      academicYear: section.academicYear,
      status: section.status,
      isVip: section.isVip ?? false,
    });
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" sınıfını silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteClassSection(id);
      setSections((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Sınıf silinemedi.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Sınıf Yönetimi"
        subtitle="VIP sınıf gruplarını oluşturun ve öğrenci atamaları için kullanın."
      />

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-2xl bg-white p-6 shadow-card"
      >
        <h2 className="text-lg font-bold text-primary">
          {editingId ? "Sınıf Düzenle" : "Yeni Sınıf Grubu"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <input
            placeholder="Sınıf Adı (örn. 8. Sınıf VIP-A) *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="rounded-lg border px-4 py-2"
          />
          <select
            value={form.gradeLevel}
            onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
            required
            className="rounded-lg border px-4 py-2"
          >
            <option value="">Sınıf Seviyesi *</option>
            {GRADE_LEVELS.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            placeholder="Kapasite"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            className="rounded-lg border px-4 py-2"
          />
          <input
            placeholder="Program (örn. Hafta içi 16:00-19:00)"
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            className="rounded-lg border px-4 py-2"
          />
          <input
            placeholder="Eğitim Yılı"
            value={form.academicYear}
            onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
            className="rounded-lg border px-4 py-2"
          />
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as ClassSection["status"] })
            }
            className="rounded-lg border px-4 py-2"
          >
            <option value="open">Açık</option>
            <option value="full">Dolu</option>
            <option value="closed">Kapalı</option>
          </select>
          <label className="flex items-center gap-2 rounded-lg border border-outline/20 px-4 py-2">
            <input
              type="checkbox"
              checked={form.isVip}
              onChange={(e) => setForm({ ...form, isVip: e.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            <span className="text-sm font-medium text-primary">VIP Sınıf</span>
          </label>
        </div>
        <div className="flex gap-2">
          <Button type="submit">
            <Plus className="h-4 w-4" />
            {editingId ? "Güncelle" : "Sınıf Ekle"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              İptal
            </Button>
          )}
        </div>
      </form>

      {sections.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-primary">Henüz sınıf grubu yok</p>
          <p className="mt-2 text-sm text-slate-text">
            Öğrenci ataması yapabilmek için önce sınıf grupları oluşturun.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => {
            const count = studentCountBySection.get(section.id) ?? 0;
            const isFull = count >= section.capacity;
            return (
              <div key={section.id} className={`rounded-2xl bg-white p-5 shadow-card ${section.isVip ? "ring-2 ring-gold" : ""}`}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-primary">{section.name}</h3>
                      {section.isVip && (
                        <span className="rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-primary">
                          VIP
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-text">{section.gradeLevel}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      section.status === "open"
                        ? "bg-gold/20 text-primary"
                        : section.status === "full"
                          ? "bg-accent-orange/15 text-accent-orange"
                          : "bg-surface-gray text-slate-text"
                    }`}
                  >
                    {section.status === "open"
                      ? "Açık"
                      : section.status === "full"
                        ? "Dolu"
                        : "Kapalı"}
                  </span>
                </div>
                <div className="mb-4 space-y-1 text-sm text-slate-text">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {count} / {section.capacity} öğrenci
                    {isFull && (
                      <span className="text-xs font-semibold text-accent-orange">
                        (Dolu)
                      </span>
                    )}
                  </p>
                  {section.schedule && <p>Program: {section.schedule}</p>}
                  <p>Dönem: {section.academicYear}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(section)}
                    className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(section.id, section.name)}
                    className="rounded-lg p-1.5 text-outline hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
