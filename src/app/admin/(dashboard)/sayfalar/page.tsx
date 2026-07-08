"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/Button";
import { getPageContent, savePageContent } from "@/lib/firebase/firestore";
import { createDefaultPage, pageRegistry, type PageSlug } from "@/lib/pages";
import type { HeroSlide, PageContent, PageSection } from "@/lib/types";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

export default function PagesAdminPage() {
  const [selectedSlug, setSelectedSlug] = useState<PageSlug>(pageRegistry[0].slug);
  const [page, setPage] = useState<PageContent | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPageContent(selectedSlug).then((data) => {
      setPage(data ?? createDefaultPage(selectedSlug as PageSlug));
    });
  }, [selectedSlug]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!page) return;
    setSaving(true);
    try {
      await savePageContent(page);
      alert("Sayfa kaydedildi.");
    } catch {
      alert("Kaydetme başarısız. Firebase bağlantısını kontrol edin.");
    } finally {
      setSaving(false);
    }
  }

  function updateSlide(index: number, field: keyof HeroSlide, value: string | boolean | number) {
    if (!page?.heroSlides) return;
    const slides = [...page.heroSlides];
    slides[index] = { ...slides[index], [field]: value };
    setPage({ ...page, heroSlides: slides });
  }

  function addSlide() {
    if (!page) return;
    const slides = page.heroSlides ?? [];
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      imageUrl: "/slider/slider1.png",
      title: "Yeni Slayt",
      subtitle: "",
      link: "",
      order: slides.length + 1,
      enabled: true,
    };
    setPage({ ...page, heroSlides: [...slides, newSlide] });
  }

  function removeSlide(index: number) {
    if (!page?.heroSlides) return;
    setPage({
      ...page,
      heroSlides: page.heroSlides.filter((_, i) => i !== index),
    });
  }

  function moveSlide(index: number, direction: "up" | "down") {
    if (!page?.heroSlides) return;
    const slides = [...page.heroSlides];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= slides.length) return;
    [slides[index], slides[target]] = [slides[target], slides[index]];
    slides.forEach((s, i) => (s.order = i + 1));
    setPage({ ...page, heroSlides: slides });
  }

  function updateSection(index: number, section: PageSection) {
    if (!page) return;
    const sections = [...page.sections];
    sections[index] = section;
    setPage({ ...page, sections });
  }

  if (!page) return <p className="text-slate-text">Yükleniyor...</p>;

  const isHomePage = selectedSlug === "anasayfa";

  return (
    <>
      <AdminHeader
        title="Sayfa Yönetimi"
        subtitle="Tüm site sayfalarının içeriklerini düzenleyin."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {pageRegistry.map((p) => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setSelectedSlug(p.slug)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedSlug === p.slug
                ? "bg-primary text-white"
                : "bg-white text-primary shadow-card hover:bg-surface-gray"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {isHomePage && (
          <div className="rounded-2xl bg-white p-8 shadow-card">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-primary">Hero Slider</h2>
                <p className="text-sm text-slate-text">
                  Anasayfa üst bölümündeki animasyonlu slider slaytları
                </p>
              </div>
              <Button type="button" size="sm" onClick={addSlide}>
                <Plus className="h-4 w-4" /> Slayt Ekle
              </Button>
            </div>

            <div className="space-y-6">
              {(page.heroSlides ?? [])
                .sort((a, b) => a.order - b.order)
                .map((slide, index) => (
                  <div
                    key={slide.id}
                    className="rounded-xl border border-outline/10 p-4"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="relative h-20 w-40 shrink-0 overflow-hidden rounded-lg bg-surface-gray">
                        {slide.imageUrl && (
                          <Image
                            src={slide.imageUrl}
                            alt={slide.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => moveSlide(index, "up")}
                          className="rounded p-1 hover:bg-surface-gray"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSlide(index, "down")}
                          className="rounded p-1 hover:bg-surface-gray"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSlide(index)}
                          className="rounded p-1 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <Field
                        label="Başlık"
                        value={slide.title}
                        onChange={(v) => updateSlide(index, "title", v)}
                      />
                      <Field
                        label="Görsel URL"
                        value={slide.imageUrl}
                        onChange={(v) => updateSlide(index, "imageUrl", v)}
                      />
                      <Field
                        label="Alt Metin"
                        value={slide.subtitle ?? ""}
                        onChange={(v) => updateSlide(index, "subtitle", v)}
                      />
                      <Field
                        label="Link (opsiyonel)"
                        value={slide.link ?? ""}
                        onChange={(v) => updateSlide(index, "link", v)}
                        placeholder="/iletisim"
                      />
                    </div>
                    <label className="mt-3 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={slide.enabled}
                        onChange={(e) =>
                          updateSlide(index, "enabled", e.target.checked)
                        }
                      />
                      Aktif
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}

        {!isHomePage && (
          <div className="rounded-2xl bg-white p-8 shadow-card space-y-4">
            <h2 className="text-lg font-bold text-primary">Hero Bölümü</h2>
            <Field
              label="Hero Başlık"
              value={page.heroTitle ?? ""}
              onChange={(v) => setPage({ ...page, heroTitle: v })}
            />
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
                className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
              />
            </div>
            <Field
              label="Hero Görsel URL (opsiyonel)"
              value={page.heroImageUrl ?? ""}
              onChange={(v) => setPage({ ...page, heroImageUrl: v })}
            />
          </div>
        )}

        {page.sections.length > 0 && (
          <div className="rounded-2xl bg-white p-8 shadow-card space-y-6">
            <h2 className="text-lg font-bold text-primary">Sayfa Bölümleri</h2>
            {page.sections.map((section, idx) => {
              if (section.type === "text-image") {
                return (
                  <div key={section.id} className="space-y-4 border-t pt-4">
                    <h3 className="font-semibold text-primary">{section.title}</h3>
                    <textarea
                      value={section.content ?? ""}
                      onChange={(e) =>
                        updateSection(idx, { ...section, content: e.target.value })
                      }
                      rows={6}
                      className="w-full rounded-lg border border-outline/30 px-4 py-3"
                    />
                    <Field
                      label="Görsel URL"
                      value={section.imageUrl ?? ""}
                      onChange={(v) =>
                        updateSection(idx, { ...section, imageUrl: v })
                      }
                    />
                  </div>
                );
              }
              if (section.type === "values" || section.type === "mission-vision") {
                return (
                  <div key={section.id} className="border-t pt-4">
                    <h3 className="mb-4 font-semibold text-primary">
                      {section.title ?? section.type}
                    </h3>
                    {section.items?.map((item, itemIdx) => (
                      <div key={itemIdx} className="mb-4 rounded-lg bg-surface-gray p-4">
                        <Field
                          label="Başlık"
                          value={item.title}
                          onChange={(v) => {
                            const items = [...(section.items ?? [])];
                            items[itemIdx] = { ...item, title: v };
                            updateSection(idx, { ...section, items });
                          }}
                        />
                        <div className="mt-2">
                          <label className="mb-1 block text-sm font-medium text-primary">
                            Açıklama
                          </label>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const items = [...(section.items ?? [])];
                              items[itemIdx] = {
                                ...item,
                                description: e.target.value,
                              };
                              updateSection(idx, { ...section, items });
                            }}
                            rows={2}
                            className="w-full rounded-lg border border-outline/30 px-4 py-3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        <Button type="submit" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Sayfayı Kaydet"}
        </Button>
      </form>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
