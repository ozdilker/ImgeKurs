"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitRegistration } from "@/lib/firebase/firestore";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { PageContent, SiteSettings } from "@/lib/types";

const grades = [
  "5. Sınıf",
  "6. Sınıf",
  "7. Sınıf",
  "8. Sınıf",
  "9. Sınıf",
  "10. Sınıf",
  "11. Sınıf",
  "12. Sınıf",
  "Mezun",
];

export function ContactForm({
  settings,
  page,
}: {
  settings: SiteSettings;
  page?: PageContent | null;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    if (data.get("kvkk") !== "on") {
      alert("KVKK metnini kabul etmeniz gerekmektedir.");
      setLoading(false);
      return;
    }

    try {
      await submitRegistration({
        studentName: data.get("studentName") as string,
        parentName: data.get("parentName") as string,
        phone: data.get("phone") as string,
        email: (data.get("email") as string) || undefined,
        grade: data.get("grade") as string,
        school: (data.get("school") as string) || undefined,
        notes: (data.get("notes") as string) || undefined,
        kvkkAccepted: true,
      });
      setSuccess(true);
      form.reset();
    } catch {
      alert("Başvuru gönderilemedi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section-padding bg-surface-gray">
      <div className="container-main">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-primary md:text-5xl">
            {page?.heroTitle ?? "İletişim & Kayıt"}
          </h1>
          <p className="mx-auto max-w-2xl text-slate-text">
            {page?.heroSubtitle ??
              "Eğitim yolculuğunuzda size eşlik etmek için buradayız. Sorularınız veya kayıt işlemleri için bizimle iletişime geçin."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6 rounded-2xl bg-white p-8 shadow-card">
              <h2 className="mb-6 text-xl font-bold text-primary">
                İletişim Bilgileri
              </h2>
              <ul className="space-y-5">
                <li className="flex items-start gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-accent-orange" />
                  <div>
                    <p className="text-sm font-semibold text-primary">Adres</p>
                    <p className="text-slate-text">{settings.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-accent-orange" />
                  <div>
                    <p className="text-sm font-semibold text-primary">Telefon</p>
                    <p className="text-slate-text">{settings.phone}</p>
                    {settings.phoneSecondary && (
                      <p className="text-slate-text">{settings.phoneSecondary}</p>
                    )}
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-accent-orange" />
                  <div>
                    <p className="text-sm font-semibold text-primary">E-Posta</p>
                    <p className="text-slate-text">{settings.email}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-accent-orange" />
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Çalışma Saatleri
                    </p>
                    <p className="text-slate-text">{settings.workingHours}</p>
                    {settings.workingHoursWeekend && (
                      <p className="text-slate-text">
                        {settings.workingHoursWeekend}
                      </p>
                    )}
                  </div>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl shadow-card">
              {settings.mapEmbedUrl ? (
                <iframe
                  title="Konum"
                  src={settings.mapEmbedUrl}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center bg-surface-gray text-sm text-slate-text">
                  Harita henüz yapılandırılmadı.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-card">
            {success ? (
              <div className="py-12 text-center">
                <p className="text-2xl font-bold text-primary">Teşekkürler!</p>
                <p className="mt-2 text-slate-text">
                  Başvurunuz başarıyla alındı.
                </p>
              </div>
            ) : (
              <>
                <h2 className="mb-2 text-xl font-bold text-primary">
                  Kayıt Kabul Sınavı Başvurusu
                </h2>
                <p className="mb-6 text-sm text-slate-text">
                  Erken kayıt avantajlarından yararlanmak ve seviyenizi
                  belirlemek için hemen başvurun.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-primary">
                        Öğrenci Adı Soyadı *
                      </label>
                      <input
                        name="studentName"
                        required
                        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-primary">
                        Veli Adı Soyadı *
                      </label>
                      <input
                        name="parentName"
                        required
                        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-primary">
                        Telefon Numarası *
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-primary">
                        E-Posta Adresi
                      </label>
                      <input
                        name="email"
                        type="email"
                        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-primary">
                        Sınıf Seviyesi *
                      </label>
                      <select
                        name="grade"
                        required
                        defaultValue=""
                        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                      >
                        <option value="" disabled>
                          Seçiniz
                        </option>
                        {grades.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-primary">
                        Okuduğu Okul
                      </label>
                      <input
                        name="school"
                        className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-primary">
                      Eklemek istedikleriniz (Opsiyonel)
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="w-full rounded-lg border border-outline/30 px-4 py-3 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <label className="flex items-start gap-2 text-sm text-slate-text">
                    <input name="kvkk" type="checkbox" required className="mt-1" />
                    KVKK Aydınlatma Metni&apos;ni okudum ve kabul ediyorum.
                  </label>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Gönderiliyor..." : "Başvuruyu Gönder"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
