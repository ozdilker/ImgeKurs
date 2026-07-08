"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { ExcelImportPanel } from "@/components/admin/ExcelImportPanel";
import { Button } from "@/components/ui/Button";
import {
  assignStudentToClass,
  deleteStudent,
  getClassSections,
  getStudents,
  saveStudent,
} from "@/lib/firebase/firestore";
import { GRADE_LEVELS } from "@/lib/grades";
import type { ClassSection, Student } from "@/lib/types";
import { Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const emptyForm = {
  fullName: "",
  gradeLevel: "",
  parentName: "",
  parentPhone: "",
  phone: "",
  email: "",
  parentEmail: "",
  school: "",
  notes: "",
  classSectionId: "",
  status: "active" as Student["status"],
};

const studentStatusLabels: Record<Student["status"], string> = {
  active: "Aktif",
  inactive: "Pasif",
  graduated: "Mezun",
  withdrawn: "Ayrıldı",
};

export default function StudentsAdminPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentData, sectionData] = await Promise.all([
        getStudents(),
        getClassSections(),
      ]);
      setStudents(studentData);
      setClassSections(sectionData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sectionMap = useMemo(
    () => new Map(classSections.map((s) => [s.id, s.name])),
    [classSections]
  );

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        !search ||
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.parentName.toLowerCase().includes(search.toLowerCase()) ||
        student.parentPhone.includes(search);
      const matchesGrade =
        gradeFilter === "all" || student.gradeLevel === gradeFilter;
      const matchesClass =
        classFilter === "all" ||
        (classFilter === "unassigned"
          ? !student.classSectionId
          : student.classSectionId === classFilter);
      return matchesSearch && matchesGrade && matchesClass;
    });
  }, [students, search, gradeFilter, classFilter]);

  const stats = useMemo(
    () => ({
      total: students.length,
      active: students.filter((s) => s.status === "active").length,
      assigned: students.filter((s) => s.classSectionId).length,
      unassigned: students.filter((s) => !s.classSectionId).length,
    }),
    [students]
  );

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(student: Student) {
    setEditingId(student.id);
    setForm({
      fullName: student.fullName,
      gradeLevel: student.gradeLevel,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      phone: student.phone ?? "",
      email: student.email ?? "",
      parentEmail: student.parentEmail ?? "",
      school: student.school ?? "",
      notes: student.notes ?? "",
      classSectionId: student.classSectionId ?? "",
      status: student.status,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const now = new Date().toISOString();
    const existing = editingId ? students.find((s) => s.id === editingId) : null;
    const student: Student = {
      id: editingId ?? `student-${Date.now()}`,
      fullName: form.fullName,
      gradeLevel: form.gradeLevel,
      parentName: form.parentName,
      parentPhone: form.parentPhone,
      phone: form.phone || undefined,
      email: form.email || undefined,
      parentEmail: form.parentEmail || undefined,
      school: form.school || undefined,
      notes: form.notes || undefined,
      classSectionId: form.classSectionId || undefined,
      status: form.status,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      registrationId: existing?.registrationId,
    };

    try {
      await saveStudent(student);
      setStudents((prev) => {
        if (editingId) {
          return prev.map((s) => (s.id === editingId ? student : s));
        }
        return [...prev, student].sort((a, b) =>
          a.fullName.localeCompare(b.fullName, "tr")
        );
      });
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      alert("Öğrenci kaydedilemedi.");
    }
  }

  async function handleClassAssign(studentId: string, classSectionId: string) {
    try {
      await assignStudentToClass(studentId, classSectionId || null);
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId
            ? {
                ...s,
                classSectionId: classSectionId || undefined,
                updatedAt: new Date().toISOString(),
              }
            : s
        )
      );
    } catch {
      alert("Sınıf ataması güncellenemedi.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" öğrencisini silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Öğrenci silinemedi.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Öğrenci Yönetimi"
        subtitle="Öğrenci kayıtları, Excel içe aktarma ve sınıf atamaları."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Toplam Öğrenci", value: stats.total },
          { label: "Aktif", value: stats.active },
          { label: "Sınıfa Atanmış", value: stats.assigned },
          { label: "Atanmamış", value: stats.unassigned },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-card">
            <p className="text-2xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-slate-text">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <ExcelImportPanel classSections={classSections} onImported={loadData} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Öğrenci, veli veya telefon ara..."
            className="w-full rounded-lg border border-outline/20 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="rounded-lg border border-outline/20 px-3 py-2 text-sm"
        >
          <option value="all">Tüm Sınıf Seviyeleri</option>
          {GRADE_LEVELS.map((grade) => (
            <option key={grade} value={grade}>
              {grade}
            </option>
          ))}
        </select>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="rounded-lg border border-outline/20 px-3 py-2 text-sm"
        >
          <option value="all">Tüm Sınıflar</option>
          <option value="unassigned">Atanmamış</option>
          {classSections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name}
            </option>
          ))}
        </select>
        <Button type="button" onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          Öğrenci Ekle
        </Button>
        <button
          onClick={loadData}
          disabled={loading}
          className="rounded-lg bg-white p-2 shadow-card hover:bg-surface-gray disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-card"
        >
          <h2 className="text-lg font-bold text-primary">
            {editingId ? "Öğrenci Düzenle" : "Yeni Öğrenci"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <input
              placeholder="Öğrenci Adı Soyadı *"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
              placeholder="Okul"
              value={form.school}
              onChange={(e) => setForm({ ...form, school: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Veli Adı Soyadı *"
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              required
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Veli Telefon *"
              value={form.parentPhone}
              onChange={(e) => setForm({ ...form, parentPhone: e.target.value })}
              required
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Veli E-Posta"
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Öğrenci Telefon"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Öğrenci E-Posta"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
            <select
              value={form.classSectionId}
              onChange={(e) => setForm({ ...form, classSectionId: e.target.value })}
              className="rounded-lg border px-4 py-2"
            >
              <option value="">Sınıf Ataması (opsiyonel)</option>
              {classSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Student["status"] })
              }
              className="rounded-lg border px-4 py-2"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="graduated">Mezun</option>
              <option value="withdrawn">Ayrıldı</option>
            </select>
            <textarea
              placeholder="Notlar"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="rounded-lg border px-4 py-2 md:col-span-2 lg:col-span-3"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Güncelle" : "Kaydet"}</Button>
            <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
              İptal
            </Button>
          </div>
        </form>
      )}

      {loading && students.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-slate-text">Öğrenciler yükleniyor...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-primary">Henüz öğrenci yok</p>
          <p className="mt-2 text-sm text-slate-text">
            Manuel ekleyin veya Excel ile toplu içe aktarın.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-outline/10 bg-surface-gray">
              <tr>
                <th className="px-4 py-3 font-semibold text-primary">Öğrenci</th>
                <th className="px-4 py-3 font-semibold text-primary">Veli</th>
                <th className="px-4 py-3 font-semibold text-primary">Seviye</th>
                <th className="px-4 py-3 font-semibold text-primary">Sınıf</th>
                <th className="px-4 py-3 font-semibold text-primary">Durum</th>
                <th className="px-4 py-3 font-semibold text-primary">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-outline/5">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEditForm(student)}
                      className="font-medium text-primary hover:text-gold"
                    >
                      {student.fullName}
                    </button>
                    {student.school && (
                      <p className="text-xs text-slate-text">{student.school}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p>{student.parentName}</p>
                    <p className="text-xs text-slate-text">{student.parentPhone}</p>
                  </td>
                  <td className="px-4 py-3">{student.gradeLevel}</td>
                  <td className="px-4 py-3">
                    <select
                      value={student.classSectionId ?? ""}
                      onChange={(e) => handleClassAssign(student.id, e.target.value)}
                      className="max-w-[180px] rounded-lg border border-outline/20 px-2 py-1 text-xs"
                    >
                      <option value="">Atanmamış</option>
                      {classSections.map((section) => (
                        <option key={section.id} value={section.id}>
                          {section.name}
                        </option>
                      ))}
                    </select>
                    {student.classSectionId && (
                      <p className="mt-1 text-xs text-slate-text">
                        {sectionMap.get(student.classSectionId)}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">{studentStatusLabels[student.status]}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(student.id, student.fullName)}
                      className="rounded p-1 text-outline hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
