"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/Button";
import { hakkimizdaSectionLabels } from "@/lib/hakkimizda-defaults";
import type { PageContent, PageSection } from "@/lib/types";
import { ChevronDown, ChevronUp } from "lucide-react";

type HakkimizdaSectionEditorProps = {
  page: PageContent;
  onChange: (page: PageContent) => void;
  onSaveSection: (sectionIndex: number) => Promise<void>;
  onSaveHero: () => Promise<void>;
  savingSectionId: string | null;
};

export function HakkimizdaSectionEditor({
  page,
  onChange,
  onSaveSection,
  onSaveHero,
  savingSectionId,
}: HakkimizdaSectionEditorProps) {
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    page.sections[0]?.id ?? null
  );

  function updateSection(index: number, section: PageSection) {
    const sections = [...page.sections];
    sections[index] = section;
    onChange({ ...page, sections });
  }

  function toggleSection(id: string) {
    setOpenSectionId((current) => (current === id ? null : id));
  }

  return (
    <div className="space-y-4">
      <SectionCard
        title="Hero Bölümü"
        open={openSectionId === "hero"}
        onToggle={() => toggleSection("hero")}
        footer={
          <Button
            type="button"
            size="sm"
            disabled={savingSectionId === "hero"}
            onClick={onSaveHero}
          >
            {savingSectionId === "hero" ? "Kaydediliyor..." : "Bu Bölümü Kaydet"}
          </Button>
        }
      >
        <Field
          label="Hero Başlık"
          value={page.heroTitle ?? ""}
          onChange={(v) => onChange({ ...page, heroTitle: v })}
        />
        <TextArea
          label="Hero Alt Metin"
          value={page.heroSubtitle ?? ""}
          onChange={(v) => onChange({ ...page, heroSubtitle: v })}
        />
      </SectionCard>

      {page.sections.map((section, index) => {
        const label =
          hakkimizdaSectionLabels[section.id] ?? section.title ?? section.type;

        return (
          <SectionCard
            key={section.id}
            title={label}
            open={openSectionId === section.id}
            onToggle={() => toggleSection(section.id)}
            footer={
              <Button
                type="button"
                size="sm"
                disabled={savingSectionId === section.id}
                onClick={() => onSaveSection(index)}
              >
                {savingSectionId === section.id ? "Kaydediliyor..." : "Bu Bölümü Kaydet"}
              </Button>
            }
          >
            {section.type === "text-image" && (
              <TextImageSectionEditor
                section={section}
                onChange={(updated) => updateSection(index, updated)}
              />
            )}

            {section.type === "mission-vision" && (
              <MissionVisionSectionEditor
                section={section}
                onChange={(updated) => updateSection(index, updated)}
              />
            )}

            {section.type === "values" && (
              <ValuesSectionEditor
                section={section}
                onChange={(updated) => updateSection(index, updated)}
              />
            )}
          </SectionCard>
        );
      })}
    </div>
  );
}

function SectionCard({
  title,
  open,
  onToggle,
  children,
  footer,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
      >
        <h3 className="font-semibold text-primary">{title}</h3>
        {open ? (
          <ChevronUp className="h-5 w-5 text-slate-text" />
        ) : (
          <ChevronDown className="h-5 w-5 text-slate-text" />
        )}
      </button>
      {open && (
        <div className="space-y-4 border-t border-outline/10 px-6 py-5">
          {children}
          {footer && <div className="pt-2">{footer}</div>}
        </div>
      )}
    </div>
  );
}

function TextImageSectionEditor({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (section: PageSection) => void;
}) {
  return (
    <>
      <Field
        label="Bölüm Başlığı"
        value={section.title ?? ""}
        onChange={(v) => onChange({ ...section, title: v })}
      />
      <TextArea
        label="İçerik"
        value={section.content ?? ""}
        onChange={(v) => onChange({ ...section, content: v })}
        rows={6}
        hint="Paragraflar arasında boş satır bırakın."
      />
      <ImageUploadField
        label="Görsel"
        value={section.imageUrl ?? ""}
        onChange={(url) => onChange({ ...section, imageUrl: url })}
        previewHeight={140}
      />
      <Field
        label="veya Görsel URL"
        value={section.imageUrl ?? ""}
        onChange={(v) => onChange({ ...section, imageUrl: v })}
      />
      {section.id === "expert-staff" && (
        <>
          <Field
            label="Buton Metni"
            value={section.buttonText ?? ""}
            onChange={(v) => onChange({ ...section, buttonText: v })}
            placeholder="Tüm Kadroyu İncele →"
          />
          <Field
            label="Buton Linki"
            value={section.buttonLink ?? ""}
            onChange={(v) => onChange({ ...section, buttonLink: v })}
            placeholder="/iletisim"
          />
        </>
      )}
    </>
  );
}

function MissionVisionSectionEditor({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (section: PageSection) => void;
}) {
  return (
    <>
      {section.items?.map((item, itemIdx) => (
        <div key={itemIdx} className="rounded-xl bg-surface-gray p-4">
          <p className="mb-3 text-sm font-semibold text-primary">
            {itemIdx === 0 ? "Misyon" : "Vizyon"}
          </p>
          <Field
            label="Başlık"
            value={item.title}
            onChange={(v) => {
              const items = [...(section.items ?? [])];
              items[itemIdx] = { ...item, title: v };
              onChange({ ...section, items });
            }}
          />
          <TextArea
            label="Açıklama"
            value={item.description}
            onChange={(v) => {
              const items = [...(section.items ?? [])];
              items[itemIdx] = { ...item, description: v };
              onChange({ ...section, items });
            }}
            rows={3}
          />
        </div>
      ))}
    </>
  );
}

function ValuesSectionEditor({
  section,
  onChange,
}: {
  section: PageSection;
  onChange: (section: PageSection) => void;
}) {
  return (
    <>
      <Field
        label="Bölüm Başlığı"
        value={section.title ?? ""}
        onChange={(v) => onChange({ ...section, title: v })}
      />
      {section.items?.map((item, itemIdx) => (
        <div key={itemIdx} className="rounded-xl bg-surface-gray p-4">
          <p className="mb-3 text-sm font-semibold text-primary">
            Değer {itemIdx + 1}
          </p>
          <Field
            label="Başlık"
            value={item.title}
            onChange={(v) => {
              const items = [...(section.items ?? [])];
              items[itemIdx] = { ...item, title: v };
              onChange({ ...section, items });
            }}
          />
          <TextArea
            label="Açıklama"
            value={item.description}
            onChange={(v) => {
              const items = [...(section.items ?? [])];
              items[itemIdx] = { ...item, description: v };
              onChange({ ...section, items });
            }}
            rows={2}
          />
        </div>
      ))}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  hint,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none disabled:bg-surface-gray"
      />
      {hint && <p className="mt-1 text-xs text-slate-text">{hint}</p>}
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-primary">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-slate-text">{hint}</p>}
    </div>
  );
}
