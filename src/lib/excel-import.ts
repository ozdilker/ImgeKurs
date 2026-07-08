import * as XLSX from "xlsx";
import type { Student } from "./types";

export type ExcelImportRow = {
  fullName: string;
  parentName: string;
  parentPhone: string;
  gradeLevel: string;
  phone?: string;
  email?: string;
  parentEmail?: string;
  school?: string;
  classSectionName?: string;
  notes?: string;
};

export type ExcelImportResult = {
  rows: ExcelImportRow[];
  errors: string[];
};

const COLUMN_ALIASES: Record<keyof ExcelImportRow, string[]> = {
  fullName: [
    "ogrenci adi soyadi",
    "ogrenci adi",
    "ad soyad",
    "adsoyad",
    "ogrenci",
    "full name",
    "fullname",
    "isim",
  ],
  parentName: ["veli adi soyadi", "veli adi", "veli", "parent name", "parentname"],
  parentPhone: [
    "veli telefon",
    "veli tel",
    "veli telefonu",
    "parent phone",
    "parentphone",
  ],
  gradeLevel: [
    "sinif seviyesi",
    "sinif",
    "sinif duzeyi",
    "grade",
    "gradelevel",
    "seviye",
  ],
  phone: ["telefon", "ogrenci telefon", "tel", "phone"],
  email: ["e-posta", "eposta", "email", "mail"],
  parentEmail: ["veli e-posta", "veli eposta", "veli email", "parent email"],
  school: ["okul", "okudugu okul", "school"],
  classSectionName: [
    "sinif grubu",
    "grup",
    "class",
    "classsection",
    "sinif adi",
    "atama sinifi",
  ],
  notes: ["not", "notlar", "aciklama", "notes"],
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

function mapHeaders(headers: unknown[]): Partial<Record<keyof ExcelImportRow, number>> {
  const mapping: Partial<Record<keyof ExcelImportRow, number>> = {};

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);
    if (!normalized) return;

    (Object.keys(COLUMN_ALIASES) as (keyof ExcelImportRow)[]).forEach((field) => {
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

export function parseStudentExcel(buffer: ArrayBuffer): ExcelImportResult {
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

  const headerRow = rawRows[0] as unknown[];
  const mapping = mapHeaders(headerRow);
  const errors: string[] = [];

  if (mapping.fullName === undefined) {
    errors.push("Zorunlu sütun bulunamadı: Öğrenci Adı Soyadı");
  }
  if (mapping.parentName === undefined) {
    errors.push("Zorunlu sütun bulunamadı: Veli Adı");
  }
  if (mapping.parentPhone === undefined) {
    errors.push("Zorunlu sütun bulunamadı: Veli Telefon");
  }
  if (mapping.gradeLevel === undefined) {
    errors.push("Zorunlu sütun bulunamadı: Sınıf Seviyesi");
  }

  if (errors.length > 0) {
    return { rows: [], errors };
  }

  const rows: ExcelImportRow[] = [];

  rawRows.slice(1).forEach((row, index) => {
    const cells = row as unknown[];
    const fullName = cellValue(cells, mapping.fullName);
    const parentName = cellValue(cells, mapping.parentName);
    const parentPhone = cellValue(cells, mapping.parentPhone);
    const gradeLevel = cellValue(cells, mapping.gradeLevel);

    if (!fullName && !parentName && !parentPhone && !gradeLevel) return;

    if (!fullName || !parentName || !parentPhone || !gradeLevel) {
      errors.push(`Satır ${index + 2}: zorunlu alanlar eksik.`);
      return;
    }

    rows.push({
      fullName,
      parentName,
      parentPhone,
      gradeLevel,
      phone: cellValue(cells, mapping.phone) || undefined,
      email: cellValue(cells, mapping.email) || undefined,
      parentEmail: cellValue(cells, mapping.parentEmail) || undefined,
      school: cellValue(cells, mapping.school) || undefined,
      classSectionName: cellValue(cells, mapping.classSectionName) || undefined,
      notes: cellValue(cells, mapping.notes) || undefined,
    });
  });

  if (rows.length === 0 && errors.length === 0) {
    errors.push("İçe aktarılacak geçerli satır bulunamadı.");
  }

  return { rows, errors };
}

export function excelRowsToStudents(
  rows: ExcelImportRow[],
  classSectionMap: Map<string, string>
): Student[] {
  const now = new Date().toISOString();

  return rows.map((row, index) => {
    const classKey = row.classSectionName?.trim().toLowerCase();
    const classSectionId = classKey ? classSectionMap.get(classKey) : undefined;

    return {
      id: `student-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      fullName: row.fullName,
      gradeLevel: row.gradeLevel,
      school: row.school,
      phone: row.phone,
      email: row.email,
      parentName: row.parentName,
      parentPhone: row.parentPhone,
      parentEmail: row.parentEmail,
      classSectionId,
      status: "active" as const,
      notes: row.notes,
      createdAt: now,
      updatedAt: now,
    };
  });
}

export function downloadStudentTemplate(): void {
  const headers = [
    "Öğrenci Adı Soyadı",
    "Veli Adı Soyadı",
    "Veli Telefon",
    "Sınıf Seviyesi",
    "Telefon",
    "E-Posta",
    "Okul",
    "Sınıf Grubu",
    "Notlar",
  ];
  const example = [
    "Ahmet Yılmaz",
    "Mehmet Yılmaz",
    "05321234567",
    "8. Sınıf",
    "",
    "ahmet@ornek.com",
    "Örnek Ortaokulu",
    "8. Sınıf VIP-A",
    "",
  ];

  const sheet = XLSX.utils.aoa_to_sheet([headers, example]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Ogrenciler");
  XLSX.writeFile(workbook, "ogrenci-listesi-sablonu.xlsx");
}
