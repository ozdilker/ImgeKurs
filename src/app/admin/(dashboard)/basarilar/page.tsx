"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import {
  deleteSuccessStory,
  getSuccessStories,
  saveSuccessStory,
} from "@/lib/firebase/firestore";
import type { SuccessStory } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";

export default function SuccessAdminPage() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [form, setForm] = useState({
    name: "",
    rank: "",
    university: "",
    department: "",
    imageUrl: "",
    quote: "",
  });

  useEffect(() => {
    getSuccessStories().then(setStories);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const story: SuccessStory = {
      id: Date.now().toString(),
      ...form,
      order: stories.length + 1,
    };
    try {
      await saveSuccessStory(story);
      setStories((prev) => [...prev, story]);
      setForm({
        name: "",
        rank: "",
        university: "",
        department: "",
        imageUrl: "",
        quote: "",
      });
    } catch {
      alert("Ekleme başarısız.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await deleteSuccessStory(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Silme başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Başarı Hikayeleri"
        subtitle="Gurur tablosu öğrencilerini yönetin."
      />

      <form
        onSubmit={handleAdd}
        className="mb-8 space-y-4 rounded-2xl bg-white p-6 shadow-card"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-lg border px-4 py-2" />
          <input placeholder="Derece" value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} required className="rounded-lg border px-4 py-2" />
          <input placeholder="Üniversite" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} required className="rounded-lg border px-4 py-2" />
          <input placeholder="Bölüm" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="rounded-lg border px-4 py-2" />
          <input placeholder="Görsel URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required className="rounded-lg border px-4 py-2 md:col-span-2" />
          <textarea placeholder="Alıntı" value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} required rows={2} className="rounded-lg border px-4 py-2 md:col-span-2" />
        </div>
        <Button type="submit" size="sm">
          <Plus className="h-4 w-4" /> Ekle
        </Button>
      </form>

      <div className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.id}
            className="flex items-center justify-between rounded-2xl bg-white p-6 shadow-card"
          >
            <div>
              <p className="font-semibold text-primary">{story.name}</p>
              <p className="text-sm text-gold">{story.rank}</p>
              <p className="text-sm text-slate-text">{story.university}</p>
            </div>
            <button onClick={() => handleDelete(story.id)} className="text-outline hover:text-red-600">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
