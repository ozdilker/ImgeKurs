"use client";

import { normalizeMapEmbedUrl, isValidMapEmbedUrl } from "@/lib/map-utils";

type MapEmbedFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function MapEmbedField({ label, value, onChange }: MapEmbedFieldProps) {
  const normalized = normalizeMapEmbedUrl(value);
  const valid = isValidMapEmbedUrl(normalized);

  function handleChange(raw: string) {
    onChange(normalizeMapEmbedUrl(raw));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        rows={4}
        placeholder='Google Maps embed src veya <iframe src="..."> kodunu yapıştırın'
        className="w-full rounded-lg border border-outline/30 px-4 py-3 font-mono text-sm focus:border-primary focus:outline-none"
      />
      <p className="mt-2 text-xs text-slate-text">
        Google Maps → Konumunuzu bulun → Paylaş → Harita yerleştir → HTML
        kopyala → <code className="rounded bg-surface-gray px-1">src=&quot;...&quot;</code>{" "}
        adresini veya tüm iframe kodunu buraya yapıştırın.
      </p>
      {!valid && normalized && (
        <p className="mt-1 text-xs text-red-600">
          Geçerli bir Google Maps embed URL&apos;si girin.
        </p>
      )}
      {normalized && valid && (
        <div className="mt-4 overflow-hidden rounded-xl border border-outline/20 shadow-card">
          <iframe
            title="Harita önizleme"
            src={normalized}
            width="100%"
            height="220"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
