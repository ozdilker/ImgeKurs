"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { getCourses, saveCourse } from "@/lib/firebase/firestore";
import type { Course } from "@/lib/types";

const emptyCourse: Omit<Course, "id"> = {
  slug: "",
  title: "",
  category: "",
  description: "",
  imageUrl: "",
  schedule: "",
  classSize: "",
  order: 0,
  status: "active",
};

export default function CourseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>("yeni");
  const [form, setForm] = useState<Omit<Course, "id"> & { id?: string }>(
    emptyCourse
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setCourseId(id);
      if (id !== "yeni") {
        getCourses().then((courses) => {
          const found = courses.find((c) => c.id === id);
          if (found) setForm(found);
        });
      }
    });
  }, [params]);

  function update(field: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const id = courseId === "yeni" ? Date.now().toString() : courseId;
    const slug =
      form.slug ||
      form.title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");

    try {
      await saveCourse({ ...form, id, slug } as Course);
      router.push("/admin/kurslar");
    } catch {
      alert("Kaydetme başarısız.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader
        title={courseId === "yeni" ? "Yeni Kurs" : "Kurs Düzenle"}
        subtitle="Kurs bilgilerini güncelleyin."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <Field label="Başlık" value={form.title} onChange={(v) => update("title", v)} />
        <Field label="Slug" value={form.slug} onChange={(v) => update("slug", v)} />
        <Field label="Kategori" value={form.category} onChange={(v) => update("category", v)} />
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">
            Açıklama
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
          />
        </div>
        <Field
          label="Görsel URL"
          value={form.imageUrl}
          onChange={(v) => update("imageUrl", v)}
        />
        <Field label="Program Saati" value={form.schedule ?? ""} onChange={(v) => update("schedule", v)} />
        <Field label="Sınıf Mevcudu" value={form.classSize ?? ""} onChange={(v) => update("classSize", v)} />
        <Field label="Etiket" value={form.tag ?? ""} onChange={(v) => update("tag", v)} />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isVip ?? false}
            onChange={(e) => update("isVip", e.target.checked)}
          />
          <span className="text-sm text-primary">VIP Program</span>
        </label>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Durum</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full rounded-lg border border-outline/30 px-4 py-3"
          >
            <option value="active">Aktif</option>
            <option value="draft">Taslak</option>
          </select>
        </div>
        <div className="flex gap-4">
          <Button type="submit" disabled={saving}>
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
        </div>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
