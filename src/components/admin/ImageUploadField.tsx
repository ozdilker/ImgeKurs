"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { uploadImagePlaceholder } from "@/lib/firebase/firestore";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
  previewHeight?: number;
};

export function ImageUploadField({
  label,
  value,
  onChange,
  hint,
  previewHeight = 80,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImagePlaceholder(file);
      onChange(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      {value && (
        <div
          className="relative mb-3 flex items-center justify-center overflow-hidden rounded-lg border border-outline/20 bg-surface-gray p-2"
          style={{ height: previewHeight }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Önizleme" className="max-h-full max-w-full object-contain" />
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... veya dosya yükleyin"
          className="min-w-0 flex-1 rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-outline/30 px-4 py-3 text-sm font-medium text-primary hover:bg-surface-gray disabled:opacity-50"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "..." : "Yükle"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {hint && <p className="mt-1 text-xs text-slate-text">{hint}</p>}
    </div>
  );
}
