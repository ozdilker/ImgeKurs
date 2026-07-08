"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import {
  deleteGalleryItem,
  getGalleryItems,
  saveGalleryItem,
} from "@/lib/firebase/firestore";
import type { GalleryItem } from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState({ title: "", imageUrl: "", category: "" });

  useEffect(() => {
    getGalleryItems().then(setItems);
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const item: GalleryItem = {
      id: Date.now().toString(),
      ...form,
      order: items.length + 1,
    };
    try {
      await saveGalleryItem(item);
      setItems((prev) => [...prev, item]);
      setForm({ title: "", imageUrl: "", category: "" });
    } catch {
      alert("Ekleme başarısız.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await deleteGalleryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert("Silme başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Galeri Ayarları"
        subtitle="Galeri görsellerini yönetin."
      />

      <form
        onSubmit={handleAdd}
        className="mb-8 grid gap-4 rounded-2xl bg-white p-6 shadow-card md:grid-cols-4"
      >
        <input
          placeholder="Başlık"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
          className="rounded-lg border border-outline/30 px-4 py-2"
        />
        <input
          placeholder="Görsel URL"
          value={form.imageUrl}
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          required
          className="rounded-lg border border-outline/30 px-4 py-2"
        />
        <input
          placeholder="Kategori"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="rounded-lg border border-outline/30 px-4 py-2"
        />
        <Button type="submit" size="sm">
          <Plus className="h-4 w-4" /> Ekle
        </Button>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white shadow-card"
          >
            <div className="relative h-40">
              <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium text-primary">{item.title}</p>
                <p className="text-xs text-slate-text">{item.category}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-outline hover:text-red-600"
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
