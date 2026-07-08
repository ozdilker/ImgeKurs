import * as XLSX from "xlsx";
import type { Student } from "./types";
import { formatPhoneValue } from "./student-firestore";

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
  university?: string;
  department?: string;
  rank?: string;
  imageUrl?: string;
  gururQuote?: string;
  showOnGururTable?: boolean;
};

export type ExcelImportResult = {
  rows: ExcelImportRow[];
  errors: string[];
};

const COLUMN_ALIASES: Record<keyof ExcelImportRow, string[]> = {
  fullName: [
    "ogrenci adi soyadi",
    "ogrenci ad soyadi",
    "ogrenci adi",
    "ad soyad",
    "adsoyad",
    "ogrenci",
    "full name",
    "fullname",
    "isim",
  ],
  parentName: [
    "veli adi soyadi",
    "veli ad soyadi",
    "veli adi",
    "veli ad soyad",
    "parent name",
    "parentname",
  ],
  parentPhone: [
    "veli telefon",
    "veli tel",
    "veli telefonu",
    "veli cep",
    "parent phone",
    "parentphone",
  ],
  gradeLevel: [
    "sinif seviyesi",
    "sinif duzeyi",
    "sinif seviye",
    "grade level",
    "gradelevel",
    "seviye",
  ],
  phone: ["ogrenci telefon", "ogrenci tel", "telefon", "tel", "phone", "cep"],
  email: ["e posta", "e-posta", "eposta", "email", "mail", "ogrenci e posta"],
  parentEmail: [
    "veli e posta",
    "veli e-posta",
    "veli eposta",
    "veli email",
    "parent email",
  ],
  school: ["okul", "okudugu okul", "school", "ogrenci okulu"],
  classSectionName: [
    "sinif grubu",
    "sinif group",
    "grup",
    "class section",
    "classsection",
    "sinif adi",
    "atama sinifi",
    "vip sinif",
  ],
  notes: ["not", "notlar", "aciklama", "notes", "ek not"],
  university: ["universite", "university", "yerlestigi universite"],
  department: ["bolum", "department", "program", "fakulte"],
  rank: ["derece", "basari", "siralama", "rank", "sonuc"],
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
  gururQuote: ["alinti", "yorum", "quote", "soz"],
  showOnGururTable: [
    "gurur tablosu",
    "gurur tablosunda goster",
    "gurur",
    "basari tablosu",
    "show on gurur",
  ],
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

function mapHeaders(headers: unknown[]): Partial<Record<keyof ExcelImportRow, number>> {
  const mapping: Partial<Record<keyof ExcelImportRow, number>> = {};
  const normalizedHeaders = headers.map((header) => normalizeHeader(header));

  const fields = Object.keys(COLUMN_ALIASES) as (keyof ExcelImportRow)[];

  // 1) Tam eşleşme
  normalizedHeaders.forEach((normalized, index) => {
    if (!normalized) return;
    fields.forEach((field) => {
      if (mapping[field] !== undefined) return;
      if (COLUMN_ALIASES[field].some((alias) => normalized === alias)) {
        mapping[field] = index;
      }
    });
  });

  // 2) Kısmi eşleşme (henüz eşleşmemiş alanlar)
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
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    return formatPhoneValue(value);
  }
  return String(value).trim();
}

function parseBooleanCell(value: string): boolean | undefined {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  if (["evet", "yes", "true", "1", "x", "goster", "aktif"].includes(normalized)) {
    return true;
  }
  if (["hayir", "no", "false", "0"].includes(normalized)) {
    return false;
  }
  return undefined;
}

function findHeaderRow(rawRows: unknown[][]): {
  headerIndex: number;
  mapping: Partial<Record<keyof ExcelImportRow, number>>;
} | null {
  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const row = rawRows[i] as unknown[];
    const mapping = mapHeaders(row);
    if (
      mapping.fullName !== undefined &&
      mapping.parentName !== undefined &&
      mapping.parentPhone !== undefined &&
      mapping.gradeLevel !== undefined
    ) {
      return { headerIndex: i, mapping };
    }
  }
  return null;
}

export function parseStudentExcel(buffer: ArrayBuffer): ExcelImportResult {
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
  const errors: string[] = [];

  if (!headerInfo) {
    return {
      rows: [],
      errors: [
        "Zorunlu sütunlar bulunamadı. Beklenen: Öğrenci Adı Soyadı, Veli Adı Soyadı, Veli Telefon, Sınıf Seviyesi",
      ],
    };
  }

  const { headerIndex, mapping } = headerInfo;
  const rows: ExcelImportRow[] = [];

  rawRows.slice(headerIndex + 1).forEach((row, index) => {
    const cells = row as unknown[];
    const fullName = cellValue(cells, mapping.fullName);
    const parentName = cellValue(cells, mapping.parentName);
    const parentPhone = cellValue(cells, mapping.parentPhone);
    const gradeLevel = cellValue(cells, mapping.gradeLevel);

    if (!fullName && !parentName && !parentPhone && !gradeLevel) return;

    const rowNumber = headerIndex + index + 2;
    if (!fullName || !parentName || !parentPhone || !gradeLevel) {
      errors.push(`Satır ${rowNumber}: zorunlu alanlar eksik.`);
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
      university: cellValue(cells, mapping.university) || undefined,
      department: cellValue(cells, mapping.department) || undefined,
      rank: cellValue(cells, mapping.rank) || undefined,
      imageUrl: cellValue(cells, mapping.imageUrl) || undefined,
      gururQuote: cellValue(cells, mapping.gururQuote) || undefined,
      showOnGururTable: parseBooleanCell(cellValue(cells, mapping.showOnGururTable)),
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
  const baseId = Date.now();

  return rows.map((row, index) => {
    const classKey = row.classSectionName?.trim().toLowerCase();
    const classSectionId = classKey ? classSectionMap.get(classKey) : undefined;
    const university = row.university?.trim();
    const department = row.department?.trim();
    const showOnGururTable =
      row.showOnGururTable ?? Boolean(university && department);

    return {
      id: `student-${baseId}-${index}-${Math.random().toString(36).slice(2, 7)}`,
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
      university,
      department,
      rank: row.rank?.trim() || undefined,
      imageUrl: row.imageUrl?.trim() || undefined,
      gururQuote: row.gururQuote?.trim() || undefined,
      showOnGururTable,
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
    "Üniversite",
    "Bölüm",
    "Derece",
    "Foto URL",
    "Gurur Tablosu",
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
    "Boğaziçi Üniversitesi",
    "Bilgisayar Mühendisliği",
    "İlk 1000",
    "",
    "Evet",
  ];

  const sheet = XLSX.utils.aoa_to_sheet([headers, example]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Ogrenciler");
  XLSX.writeFile(workbook, "ogrenci-listesi-sablonu.xlsx");
}
