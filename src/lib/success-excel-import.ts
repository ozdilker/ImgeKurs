import * as XLSX from "xlsx";
import type { SuccessStory } from "./types";
import { resolveSuccessStoryImage } from "./success-story-utils";

export type SuccessExcelRow = {
  name: string;
  rank: string;
  university: string;
  department: string;
  imageUrl?: string;
  quote?: string;
};

export type SuccessExcelImportResult = {
  rows: SuccessExcelRow[];
  errors: string[];
};

const COLUMN_ALIASES: Record<keyof SuccessExcelRow, string[]> = {
  name: ["isim", "ad soyad", "adsoyad", "name", "ogrenci adi", "ogrenci", "ad"],
  rank: ["derece", "basari", "siralama", "rank", "sonuc"],
  university: ["universite", "university", "yerlestigi universite"],
  department: ["bolum", "department", "program", "fakulte"],
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
    .replace(/^\uFEFF/, "")
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
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));
  const fields = Object.keys(COLUMN_ALIASES) as (keyof SuccessExcelRow)[];

  normalizedHeaders.forEach((normalized, index) => {
    if (!normalized) return;
    fields.forEach((field) => {
      if (mapping[field] !== undefined) return;
      if (COLUMN_ALIASES[field].some((alias) => normalized === alias)) {
        mapping[field] = index;
      }
    });
  });

  normalizedHeaders.forEach((normalized, index) => {
    if (!normalized) return;
    fields.forEach((field) => {
      if (mapping[field] !== undefined) return;
      if (
        COLUMN_ALIASES[field].some(
          (alias) => normalized.includes(alias) || alias.includes(normalized)
        )
      ) {
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

function findHeaderRow(rawRows: unknown[][]): {
  headerIndex: number;
  mapping: Partial<Record<keyof SuccessExcelRow, number>>;
} | null {
  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const mapping = mapHeaders(rawRows[i] as unknown[]);
    if (
      mapping.name !== undefined &&
      mapping.university !== undefined &&
      mapping.department !== undefined
    ) {
      return { headerIndex: i, mapping };
    }
  }
  return null;
}

export function parseSuccessStoryExcel(buffer: ArrayBuffer): SuccessExcelImportResult {
  const workbook = XLSX.read(buffer, { type: "array", cellDates: false });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { rows: [], errors: ["Excel dosyasında sayfa bulunamadı."] };
  }

  const sheet = workbook.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: "",
    raw: false,
  }) as unknown[][];

  if (rawRows.length < 2) {
    return {
      rows: [],
      errors: ["Excel dosyasında başlık satırı ve en az bir veri satırı olmalı."],
    };
  }

  const headerInfo = findHeaderRow(rawRows);
  if (!headerInfo) {
    return {
      rows: [],
      errors: [
        "Zorunlu sütunlar bulunamadı. Beklenen: İsim, Üniversite, Bölüm",
      ],
    };
  }

  const { headerIndex, mapping } = headerInfo;
  const errors: string[] = [];
  const rows: SuccessExcelRow[] = [];

  rawRows.slice(headerIndex + 1).forEach((row, index) => {
    const cells = row as unknown[];
    const name = cellValue(cells, mapping.name);
    const rank = cellValue(cells, mapping.rank);
    const university = cellValue(cells, mapping.university);
    const department = cellValue(cells, mapping.department);

    if (!name && !university && !department) return;

    const rowNumber = headerIndex + index + 2;
    if (!name || !university || !department) {
      errors.push(`Satır ${rowNumber}: İsim, Üniversite ve Bölüm zorunludur.`);
      return;
    }

    rows.push({
      name,
      rank: rank || "",
      university,
      department,
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
  const baseId = Date.now();

  return rows.map((row, index) => ({
    id: `success-${baseId}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    name: row.name,
    rank: row.rank,
    university: row.university,
    department: row.department,
    imageUrl: resolveSuccessStoryImage(row.imageUrl),
    quote: row.quote ?? "",
    order: startOrder + index + 1,
  }));
}

export function downloadSuccessStoryTemplate(): void {
  const headers = ["İsim", "Üniversite", "Bölüm", "Derece", "Foto URL", "Alıntı"];
  const example = [
    "Ahmet Yılmaz",
    "Boğaziçi Üniversitesi",
    "Bilgisayar Mühendisliği",
    "",
    "",
    "",
  ];

  const sheet = XLSX.utils.aoa_to_sheet([headers, example]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Basari Hikayeleri");
  XLSX.writeFile(workbook, "basari-hikayeleri-sablonu.xlsx");
}
