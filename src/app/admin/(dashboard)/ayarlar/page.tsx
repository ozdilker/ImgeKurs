"use client";

import { useEffect, useState } from "react";
import { revalidateSiteLayout } from "@/app/actions/revalidate";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { MapEmbedField } from "@/components/admin/MapEmbedField";
import { Button } from "@/components/ui/Button";
import { getSiteSettings, saveSiteSettings } from "@/lib/firebase/firestore";
import type { SiteSettings } from "@/lib/types";
import { defaultSiteSettings } from "@/lib/seed-data";

export default function SettingsAdminPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  function update(field: keyof SiteSettings, value: string) {
    setSettings((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings(settings);
      await revalidateSiteLayout();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Kaydetme başarısız. Firebase yapılandırmasını kontrol edin."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AdminHeader
        title="Site Ayarları"
        subtitle="Genel site bilgilerini düzenleyin."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-2xl bg-white p-8 shadow-card"
      >
        {saved && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            Ayarlar kaydedildi.
          </div>
        )}

        <Field label="Site Adı" value={settings.siteName} onChange={(v) => update("siteName", v)} />
        <Field label="Slogan" value={settings.tagline} onChange={(v) => update("tagline", v)} />

        <ImageUploadField
          label="Site Logosu"
          value={settings.logoUrl ?? ""}
          onChange={(v) => update("logoUrl", v)}
          hint="Dosya yükleyin veya Firebase Storage / harici bir görsel URL'si girin. Kaydet'e bastıktan sonra site güncellenir."
          previewHeight={100}
        />

        {settings.logoUrl && (
          <button
            type="button"
            onClick={() => update("logoUrl", "")}
            className="text-sm text-red-600 hover:underline"
          >
            Logoyu kaldır (metin logosuna dön)
          </button>
        )}

        <Field label="Telefon" value={settings.phone} onChange={(v) => update("phone", v)} />
        <Field label="İkinci Telefon" value={settings.phoneSecondary ?? ""} onChange={(v) => update("phoneSecondary", v)} />
        <Field label="E-posta" value={settings.email} onChange={(v) => update("email", v)} />
        <Field label="Adres" value={settings.address} onChange={(v) => update("address", v)} />

        <MapEmbedField
          label="Google Maps Harita (Embed)"
          value={settings.mapEmbedUrl ?? ""}
          onChange={(v) => update("mapEmbedUrl", v)}
        />

        <Field label="Çalışma Saatleri" value={settings.workingHours} onChange={(v) => update("workingHours", v)} />
        <Field label="Hafta Sonu" value={settings.workingHoursWeekend ?? ""} onChange={(v) => update("workingHoursWeekend", v)} />
        <Field label="Hero Başlık" value={settings.heroTitle} onChange={(v) => update("heroTitle", v)} />
        <Field label="Hero Vurgu" value={settings.heroHighlight} onChange={(v) => update("heroHighlight", v)} />
        <Field label="Hero Alt Metin" value={settings.heroSubtitle} onChange={(v) => update("heroSubtitle", v)} />
        <Field label="Hero Görsel URL" value={settings.heroImageUrl} onChange={(v) => update("heroImageUrl", v)} />

        <Button type="submit" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
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
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
      />
    </div>
  );
}
