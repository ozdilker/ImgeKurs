import * as XLSX from "xlsx";
import type { SuccessStory } from "./types";
import { resolveSuccessStoryImage } from "./success-story-utils";

export type SuccessExcelRow = {
  name: string;
  rank: string;
  university: string;
  department?: string;
  imageUrl?: string;
  quote?: string;
};

export type SuccessExcelImportResult = {
  rows: SuccessExcelRow[];
  errors: string[];
};

const COLUMN_ALIASES: Record<keyof SuccessExcelRow, string[]> = {
  name: ["ad soyad", "adsoyad", "isim", "name", "ogrenci adi", "ogrenci"],
  rank: ["derece", "basari", "siralama", "rank", "sonuc"],
  university: ["universite", "okul", "university", "yerlestigi okul"],
  department: ["bolum", "department", "program"],
  imageUrl: [
    "foto",
    "fotograf",
    "foto url",
    "foto link",
    "gorunt url",
    "gorsel url",
    "gorsel",
    "image",
    "imageurl",
    "resim",
    "resim url",
  ],
  quote: ["alinti", "yorum", "quote", "soz", "aciklama"],
};

function normalizeHeader(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapHeaders(headers: unknown[]): Partial<Record<keyof SuccessExcelRow, number>> {
  const mapping: Partial<Record<keyof SuccessExcelRow, number>> = {};

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (!normalized) return;

    (Object.keys(COLUMN_ALIASES) as (keyof SuccessExcelRow)[]).forEach((field) => {
      if (mapping[field] !== undefined) return;
      if (COLUMN_ALIASES[field].some((alias) => normalized === alias || normalized.includes(alias))) {
        mapping[field] = index;
      }
    });
  });

  return mapping;
}

function cellValue(row: unknown[], index: number | undefined): string {
  if (index === undefined) return "";
  const value = row[index];
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

export function parseSuccessStoryExcel(buffer: ArrayBuffer): SuccessExcelImportResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { rows: [], errors: ["Excel dosyasında sayfa bulunamadı."] };
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
  });

  if (rawRows.length < 2) {
    return {
      rows: [],
      errors: ["Excel dosyasında başlık satırı ve en az bir veri satırı olmalı."],
    };
  }

  const mapping = mapHeaders(rawRows[0] as unknown[]);
  const errors: string[] = [];

  if (mapping.name === undefined) errors.push("Zorunlu sütun bulunamadı: Ad Soyad");
  if (mapping.university === undefined) errors.push("Zorunlu sütun bulunamadı: Üniversite");

  if (errors.length > 0) {
    return { rows: [], errors };
  }

  const rows: SuccessExcelRow[] = [];

  rawRows.slice(1).forEach((row, index) => {
    const cells = row as unknown[];
    const name = cellValue(cells, mapping.name);
    const rank = cellValue(cells, mapping.rank);
    const university = cellValue(cells, mapping.university);

    if (!name && !rank && !university) return;

    if (!name || !university) {
      errors.push(`Satır ${index + 2}: Ad Soyad ve Üniversite zorunludur.`);
      return;
    }

    rows.push({
      name,
      rank: rank || "",
      university,
      department: cellValue(cells, mapping.department) || undefined,
      imageUrl: cellValue(cells, mapping.imageUrl) || undefined,
      quote: cellValue(cells, mapping.quote) || undefined,
    });
  });

  if (rows.length === 0 && errors.length === 0) {
    errors.push("İçe aktarılacak geçerli satır bulunamadı.");
  }

  return { rows, errors };
}

export function excelRowsToSuccessStories(
  rows: SuccessExcelRow[],
  startOrder: number
): SuccessStory[] {
  return rows.map((row, index) => ({
    id: `success-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    name: row.name,
    rank: row.rank,
    university: row.university,
    department: row.department ?? "",
    imageUrl: resolveSuccessStoryImage(row.imageUrl),
    quote: row.quote ?? "",
    order: startOrder + index + 1,
  }));
}

export function downloadSuccessStoryTemplate(): void {
  const headers = [
    "Ad Soyad",
    "Derece",
    "Üniversite",
    "Bölüm",
    "Foto URL",
    "Alıntı",
  ];
  const example = [
    "Ahmet Yılmaz",
    "YKS Sayısal Türkiye 882.si",
    "Boğaziçi Üniversitesi",
    "Bilgisayar Mühendisliği",
    "",
    "İmge VIP'te aldığım destek sayesinde hedefime ulaştım.",
  ];

  const sheet = XLSX.utils.aoa_to_sheet([headers, example]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Basari Hikayeleri");
  XLSX.writeFile(workbook, "basari-hikayeleri-sablonu.xlsx");
}
