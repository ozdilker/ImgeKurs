"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { getPageContent, savePageContent } from "@/lib/firebase/firestore";
import type { PageContent } from "@/lib/types";

const pages = [
  { slug: "hakkimizda", label: "Hakkımızda" },
];

export default function PagesAdminPage() {
  const [selectedSlug, setSelectedSlug] = useState("hakkimizda");
  const [page, setPage] = useState<PageContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPageContent(selectedSlug).then(setPage);
  }, [selectedSlug]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!page) return;
    setSaving(true);
    try {
      await savePageContent(page);
      alert("Sayfa kaydedildi.");
    } catch {
      alert("Kaydetme başarısız.");
    } finally {
      setSaving(false);
    }
  }

  if (!page) return <p className="text-slate-text">Yükleniyor...</p>;

  return (
    <>
      <AdminHeader
        title="Sayfa Yönetimi"
        subtitle="Site sayfalarının içeriklerini düzenleyin."
      />

      <div className="mb-6 flex gap-2">
        {pages.map((p) => (
          <button
            key={p.slug}
            onClick={() => setSelectedSlug(p.slug)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedSlug === p.slug
                ? "bg-primary text-white"
                : "bg-white text-primary shadow-card"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSave}
        className="max-w-2xl space-y-4 rounded-2xl bg-white p-8 shadow-card"
      >
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">
            Hero Başlık
          </label>
          <input
            value={page.heroTitle ?? ""}
            onChange={(e) =>
              setPage({ ...page, heroTitle: e.target.value })
            }
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-primary">
            Hero Alt Metin
          </label>
          <textarea
            value={page.heroSubtitle ?? ""}
            onChange={(e) =>
              setPage({ ...page, heroSubtitle: e.target.value })
            }
            rows={3}
            className="w-full rounded-lg border px-4 py-3"
          />
        </div>

        {page.sections.map((section, idx) =>
          section.type === "text-image" ? (
            <div key={section.id} className="space-y-4 border-t pt-4">
              <h3 className="font-semibold text-primary">{section.title}</h3>
              <textarea
                value={section.content ?? ""}
                onChange={(e) => {
                  const sections = [...page.sections];
                  sections[idx] = { ...section, content: e.target.value };
                  setPage({ ...page, sections });
                }}
                rows={6}
                className="w-full rounded-lg border px-4 py-3"
              />
              <input
                value={section.imageUrl ?? ""}
                onChange={(e) => {
                  const sections = [...page.sections];
                  sections[idx] = { ...section, imageUrl: e.target.value };
                  setPage({ ...page, sections });
                }}
                placeholder="Görsel URL"
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>
          ) : null
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Sayfayı Kaydet"}
        </Button>
      </form>
    </>
  );
}
