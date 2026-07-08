"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SuccessExcelImportPanel } from "@/components/admin/SuccessExcelImportPanel";
import { Button } from "@/components/ui/Button";
import {
  deleteSuccessStory,
  getSuccessStories,
  saveSuccessStory,
} from "@/lib/firebase/firestore";
import {
  resolveSuccessStoryImage,
  SUCCESS_STORY_PLACEHOLDER,
} from "@/lib/success-story-utils";
import type { SuccessStory } from "@/lib/types";
import { Pencil, Plus, Trash2, X } from "lucide-react";

const emptyForm = {
  name: "",
  rank: "",
  university: "",
  department: "",
  imageUrl: "",
  quote: "",
};

export default function SuccessAdminPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadStories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getSuccessStories();
      setStories(data.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(story: SuccessStory) {
    setEditingId(story.id);
    setForm({
      name: story.name,
      rank: story.rank,
      university: story.university,
      department: story.department,
      imageUrl:
        story.imageUrl === SUCCESS_STORY_PLACEHOLDER ? "" : story.imageUrl,
      quote: story.quote,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const existing = editingId ? stories.find((s) => s.id === editingId) : null;
    const story: SuccessStory = {
      id: editingId ?? `success-${Date.now()}`,
      name: form.name.trim(),
      rank: form.rank.trim(),
      university: form.university.trim(),
      department: form.department.trim(),
      imageUrl: resolveSuccessStoryImage(form.imageUrl),
      quote: form.quote.trim(),
      order: existing?.order ?? stories.length + 1,
    };

    try {
      await saveSuccessStory(story);
      setStories((prev) => {
        if (editingId) {
          return prev
            .map((s) => (s.id === editingId ? story : s))
            .sort((a, b) => a.order - b.order);
        }
        return [...prev, story].sort((a, b) => a.order - b.order);
      });
      closeForm();
    } catch {
      alert("Kayıt başarısız.");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" kaydını silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteSuccessStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
      if (editingId === id) closeForm();
    } catch {
      alert("Silme başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Başarı Hikayeleri"
        subtitle="Gurur tablosu kişilerini Excel ile yükleyin veya tek tek düzenleyin."
      />

      <div className="mb-6">
        <SuccessExcelImportPanel currentCount={stories.length} onImported={loadStories} />
      </div>

      <div className="mb-4 flex justify-end">
        <Button type="button" onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          Kişi Ekle
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">
              {editingId ? "Kişiyi Düzenle" : "Yeni Kişi Ekle"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-lg p-1 text-slate-text hover:bg-surface-gray"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Ad Soyad *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Derece *"
              value={form.rank}
              onChange={(e) => setForm({ ...form, rank: e.target.value })}
              required
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Üniversite / Okul *"
              value={form.university}
              onChange={(e) => setForm({ ...form, university: e.target.value })}
              required
              className="rounded-lg border px-4 py-2"
            />
            <input
              placeholder="Bölüm"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="rounded-lg border px-4 py-2"
            />
          </div>

          <ImageUploadField
            label="Fotoğraf"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            hint="Boş bırakılırsa varsayılan placeholder kullanılır."
            previewHeight={120}
          />
          <input
            placeholder="veya Foto URL yapıştırın"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full rounded-lg border px-4 py-2 text-sm"
          />

          <textarea
            placeholder="Alıntı / Yorum"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            rows={3}
            className="w-full rounded-lg border px-4 py-2"
          />

          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Güncelle" : "Kaydet"}</Button>
            <Button type="button" variant="secondary" onClick={closeForm}>
              İptal
            </Button>
          </div>
        </form>
      )}

      {loading && stories.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-slate-text">Yükleniyor...</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-primary">Henüz kayıt yok</p>
          <p className="mt-2 text-sm text-slate-text">
            Excel şablonunu indirip liste yükleyebilir veya tek tek ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <article
              key={story.id}
              className="overflow-hidden rounded-2xl bg-white shadow-card"
            >
              <div className="relative h-40 bg-surface-gray">
                <Image
                  src={resolveSuccessStoryImage(story.imageUrl)}
                  alt={story.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="font-semibold text-primary">{story.name}</p>
                <p className="text-sm font-medium text-gold">{story.rank}</p>
                <p className="mt-1 text-sm text-slate-text">
                  {story.university}
                  {story.department ? ` · ${story.department}` : ""}
                </p>
                {story.quote && (
                  <p className="mt-3 line-clamp-2 text-xs italic text-slate-text">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEditForm(story)}
                    className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(story.id, story.name)}
                    className="rounded-lg p-1.5 text-outline hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
