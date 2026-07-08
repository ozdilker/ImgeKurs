"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  downloadSuccessStoryTemplate,
  excelRowsToSuccessStories,
  parseSuccessStoryExcel,
} from "@/lib/success-excel-import";
import { bulkSaveSuccessStories } from "@/lib/firebase/firestore";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

type SuccessExcelImportPanelProps = {
  currentCount: number;
  onImported: () => void;
};

export function SuccessExcelImportPanel({
  currentCount,
  onImported,
}: SuccessExcelImportPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewCount, setPreviewCount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [pendingBuffer, setPendingBuffer] = useState<ArrayBuffer | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const result = parseSuccessStoryExcel(buffer);
    setPendingBuffer(result.rows.length > 0 ? buffer : null);
    setPreviewCount(result.rows.length);
    setErrors(result.errors);
    e.target.value = "";
  }

  async function handleImport() {
    if (!pendingBuffer) return;
    setImporting(true);
    try {
      const result = parseSuccessStoryExcel(pendingBuffer);
      if (result.errors.length > 0 && result.rows.length === 0) {
        setErrors(result.errors);
        return;
      }

      const stories = excelRowsToSuccessStories(result.rows, currentCount);
      await bulkSaveSuccessStories(stories);
      setPendingBuffer(null);
      setPreviewCount(0);
      setErrors(result.errors);
      onImported();
      alert(`${stories.length} başarı hikayesi içe aktarıldı.`);
    } catch {
      alert("Excel içe aktarma başarısız.");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-primary">Excel ile Toplu Ekle</h2>
          <p className="mt-1 text-sm text-slate-text">
            .xlsx dosyası yükleyin. Foto URL boş bırakılırsa otomatik placeholder
            kullanılır.
          </p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={downloadSuccessStoryTemplate}>
          <Download className="h-4 w-4" />
          Şablon İndir
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          <Upload className="h-4 w-4" />
          Excel Dosyası Seç
        </Button>
        {previewCount > 0 && (
          <>
            <span className="flex items-center gap-2 text-sm text-slate-text">
              <FileSpreadsheet className="h-4 w-4" />
              {previewCount} kişi içe aktarılmaya hazır
            </span>
            <Button type="button" onClick={handleImport} disabled={importing}>
              {importing ? "Aktarılıyor..." : "İçe Aktar"}
            </Button>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <div className="mt-4 rounded-lg bg-surface-gray p-4 text-xs text-slate-text">
        <p className="font-semibold text-primary">Beklenen sütunlar</p>
        <p className="mt-1">
          Ad Soyad, Üniversite (zorunlu) · Derece, Bölüm, Foto URL, Alıntı (opsiyonel)
        </p>
      </div>
    </div>
  );
}
