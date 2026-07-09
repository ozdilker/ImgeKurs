"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import { revalidateProgramPages } from "@/app/actions/revalidate";
import { getCourses, saveCourse } from "@/lib/firebase/firestore";
import { getNextCourseOrder, slugifyCourseTitle } from "@/lib/courses";
import type { Course } from "@/lib/types";

const emptyCourse: Omit<Course, "id"> = {
  slug: "",
  title: "",
  category: "",
  description: "",
  imageUrl: "",
  schedule: "",
  classSize: "",
  order: 1,
  status: "active",
  isVip: false,
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
      getCourses().then((courses) => {
        if (id !== "yeni") {
          const found = courses.find((c) => c.id === id);
          if (found) setForm(found);
          return;
        }

        setForm((prev) => ({
          ...prev,
          order: getNextCourseOrder(courses),
        }));
      });
    });
  }, [params]);

  function update(field: string, value: string | boolean | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const id = courseId === "yeni" ? Date.now().toString() : courseId;
    const slug = form.slug.trim() || slugifyCourseTitle(form.title);

    if (!form.title.trim() || !form.category.trim() || !form.description.trim()) {
      alert("Başlık, kategori ve açıklama zorunludur.");
      setSaving(false);
      return;
    }

    if (!form.imageUrl.trim()) {
      alert("Program görseli zorunludur. Lütfen bir görsel yükleyin veya URL girin.");
      setSaving(false);
      return;
    }

    if (!slug) {
      alert("Geçerli bir slug oluşturulamadı. Lütfen slug alanını doldurun.");
      setSaving(false);
      return;
    }

    const courses = await getCourses();
    const duplicateSlug = courses.some(
      (course) => course.slug === slug && course.id !== id
    );
    if (duplicateSlug) {
      alert("Bu slug başka bir programda kullanılıyor. Farklı bir slug girin.");
      setSaving(false);
      return;
    }

    try {
      await saveCourse({
        ...form,
        id,
        slug,
        title: form.title.trim(),
        category: form.category.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
        schedule: form.schedule?.trim() || undefined,
        classSize: form.classSize?.trim() || undefined,
        tag: form.tag?.trim() || undefined,
        isVip: form.isVip === true,
        order: Number(form.order) || 1,
        status: form.status,
      } as Course);
      await revalidateProgramPages();
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
        title={courseId === "yeni" ? "Yeni Eğitim Programı" : "Program Düzenle"}
        subtitle="Program bilgilerini girin ve VIP durumunu belirleyin."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <Field
          label="Program Başlığı *"
          value={form.title}
          onChange={(v) => update("title", v)}
          required
        />
        <Field
          label="Slug (URL)"
          value={form.slug}
          onChange={(v) => update("slug", v)}
          placeholder="Boş bırakılırsa başlıktan otomatik oluşturulur"
        />
        <Field
          label="Kategori *"
          value={form.category}
          onChange={(v) => update("category", v)}
          placeholder="Örn. ORTAOKUL, LİSE, LGS HAZIRLIK"
          required
        />
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">
            Açıklama *
          </label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            rows={4}
            required
            className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
          />
        </div>

        <ImageUploadField
          label="Program Görseli"
          value={form.imageUrl}
          onChange={(url) => update("imageUrl", url)}
          hint="Kart ve detay sayfasında gösterilir."
          previewHeight={160}
        />
        <Field
          label="veya Görsel URL"
          value={form.imageUrl}
          onChange={(v) => update("imageUrl", v)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Program Saati"
            value={form.schedule ?? ""}
            onChange={(v) => update("schedule", v)}
            placeholder="Hafta içi 16:00 - 19:00"
          />
          <Field
            label="Sınıf Mevcudu"
            value={form.classSize ?? ""}
            onChange={(v) => update("classSize", v)}
            placeholder="Max 12 Kişi"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Etiket"
            value={form.tag ?? ""}
            onChange={(v) => update("tag", v)}
            placeholder="VIP Sınıflar"
          />
          <Field
            label="Sıra"
            value={String(form.order ?? 1)}
            onChange={(v) => update("order", Number(v) || 1)}
            type="number"
          />
        </div>

        <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isVip ?? false}
              onChange={(e) => update("isVip", e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            <div>
              <span className="text-sm font-semibold text-primary">VIP Program</span>
              <p className="text-xs text-slate-text">
                İşaretlenirse kart altın çerçeveli görünür ve VIP rozeti eklenir.
              </p>
            </div>
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-primary">Durum</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full rounded-lg border border-outline/30 px-4 py-3"
          >
            <option value="active">Aktif (sitede göster)</option>
            <option value="draft">Taslak (gizli)</option>
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
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
