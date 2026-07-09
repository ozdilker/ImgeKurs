"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { revalidateGalleryPage } from "@/app/actions/revalidate";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import {
  deleteGalleryItem,
  getGalleryItems,
  saveGalleryItem,
} from "@/lib/firebase/firestore";
import { uploadImage } from "@/lib/firebase/storage";
import type { GalleryItem } from "@/lib/types";
import { Images, Pencil, Plus, Trash2, Upload, X } from "lucide-react";

const GALLERY_CATEGORIES = [
  "Sınıflar",
  "Tesisler",
  "Etkinlikler",
  "Sınavlar",
  "Rehberlik",
  "Genel",
];

const emptyForm = {
  title: "",
  imageUrl: "",
  category: "Genel",
};

function titleFromFileName(fileName: string): string {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
}

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [bulkCategory, setBulkCategory] = useState("Genel");
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const bulkInputId = useId();

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getGalleryItems();
      setItems(data.sort((a, b) => a.order - b.order));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(item: GalleryItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      category: item.category,
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
    if (!form.imageUrl.trim()) {
      alert("Lütfen bir görsel yükleyin veya URL girin.");
      return;
    }

    const existing = editingId ? items.find((i) => i.id === editingId) : null;
    const item: GalleryItem = {
      id: editingId ?? `gallery-${Date.now()}`,
      title: form.title.trim(),
      imageUrl: form.imageUrl.trim(),
      category: form.category.trim() || "Genel",
      order: existing?.order ?? items.length + 1,
    };

    try {
      await saveGalleryItem(item);
      await revalidateGalleryPage();
      setItems((prev) => {
        if (editingId) {
          return prev
            .map((i) => (i.id === editingId ? item : i))
            .sort((a, b) => a.order - b.order);
        }
        return [...prev, item].sort((a, b) => a.order - b.order);
      });
      closeForm();
    } catch {
      alert("Kayıt başarısız.");
    }
  }

  async function handleBulkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    setBulkUploading(true);
    const newItems: GalleryItem[] = [];
    const errors: string[] = [];
    let order = items.length;
    const batchId = Date.now();

    try {
      for (const [index, file] of files.entries()) {
        try {
          const imageUrl = await uploadImage(file, "uploads/gallery");
          order += 1;
          newItems.push({
            id: `gallery-${batchId}-${index}-${Math.random().toString(36).slice(2, 7)}`,
            title: titleFromFileName(file.name) || `Görsel ${order}`,
            imageUrl,
            category: bulkCategory,
            order,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Bilinmeyen hata";
          errors.push(`"${file.name}": ${message}`);
        }
      }

      for (const item of newItems) {
        await saveGalleryItem(item);
      }

      if (newItems.length > 0) {
        await revalidateGalleryPage();
        setItems((prev) =>
          [...prev, ...newItems].sort((a, b) => a.order - b.order)
        );
        alert(`${newItems.length} görsel galeriye eklendi.`);
      } else if (errors.length === 0) {
        alert("Yüklenecek geçerli görsel bulunamadı.");
      }

      if (errors.length > 0) {
        alert(errors.join("\n"));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Toplu yükleme başarısız.";
      alert(message);
    } finally {
      setBulkUploading(false);
      if (bulkInputRef.current) bulkInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" görselini silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteGalleryItem(id);
      await revalidateGalleryPage();
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (editingId === id) closeForm();
    } catch {
      alert("Silme başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Galeri Ayarları"
        subtitle="Görselleri yükleyin, düzenleyin ve kategorilere ayırın."
      />

      <div className="mb-6 rounded-2xl bg-white p-6 shadow-card">
        <h2 className="mb-2 text-lg font-bold text-primary">Toplu Görsel Yükle</h2>
        <p className="mb-4 text-sm text-slate-text">
          Birden fazla görseli aynı anda seçip galeriye ekleyebilirsiniz.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={bulkCategory}
            onChange={(e) => setBulkCategory(e.target.value)}
            className="rounded-lg border border-outline/30 px-4 py-2 text-sm"
          >
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            id={bulkInputId}
            ref={bulkInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/*"
            multiple
            className="sr-only"
            disabled={bulkUploading}
            onChange={handleBulkUpload}
          />
          <label
            htmlFor={bulkInputId}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-primary transition-all duration-200 hover:bg-gold/90 ${
              bulkUploading ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <Upload className="h-4 w-4" />
            {bulkUploading ? "Yükleniyor..." : "Çoklu Görsel Seç"}
          </label>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <Button type="button" onClick={openCreateForm}>
          <Plus className="h-4 w-4" />
          Görsel Ekle
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 space-y-4 rounded-2xl bg-white p-6 shadow-card"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">
              {editingId ? "Görseli Düzenle" : "Yeni Görsel"}
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
              placeholder="Başlık *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="rounded-lg border border-outline/30 px-4 py-2"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded-lg border border-outline/30 px-4 py-2"
            >
              {GALLERY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <ImageUploadField
            label="Görsel *"
            value={form.imageUrl}
            onChange={(url) => setForm({ ...form, imageUrl: url })}
            hint="Dosya yükleyin veya görsel URL'si yapıştırın."
            previewHeight={160}
            folder="uploads/gallery"
          />

          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Güncelle" : "Kaydet"}</Button>
            <Button type="button" variant="secondary" onClick={closeForm}>
              İptal
            </Button>
          </div>
        </form>
      )}

      {loading && items.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-slate-text">Galeri yükleniyor...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <Images className="mx-auto mb-3 h-10 w-10 text-outline" />
          <p className="text-lg font-semibold text-primary">Henüz görsel yok</p>
          <p className="mt-2 text-sm text-slate-text">
            Toplu yükleme veya tek tek görsel ekleyerek galeriyi oluşturun.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-card"
            >
              <div className="relative h-44 bg-surface-gray">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-primary">{item.title}</p>
                  <p className="text-xs text-slate-text">{item.category}</p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditForm(item)}
                    className="rounded-lg p-1.5 text-outline hover:bg-surface-gray hover:text-primary"
                    title="Düzenle"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    className="rounded-lg p-1.5 text-outline hover:bg-red-50 hover:text-red-600"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
