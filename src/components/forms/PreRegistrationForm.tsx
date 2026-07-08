"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitRegistration } from "@/lib/firebase/firestore";

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

export function PreRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      await submitRegistration({
        studentName: data.get("studentName") as string,
        parentName: data.get("parentName") as string,
        phone: data.get("phone") as string,
        email: (data.get("email") as string) || undefined,
        grade: data.get("grade") as string,
        school: (data.get("school") as string) || undefined,
        notes: (data.get("notes") as string) || undefined,
        kvkkAccepted: data.get("kvkk") === "on",
      });
      setSuccess(true);
      form.reset();
    } catch {
      alert("Başvuru gönderilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-primary p-8 text-center text-white">
        <p className="text-xl font-semibold text-gold">Başvurunuz Alındı!</p>
        <p className="mt-2 text-white/70">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-primary p-8 shadow-card">
      <h3 className="mb-2 text-xl font-bold text-white">Ön Kayıt Oluşturun</h3>
      <p className="mb-6 text-sm text-white/60">
        Bilgi almak için formu doldurun, sizi arayalım.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="studentName"
          required
          placeholder="Ad Soyad"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
        />
        <input
          name="phone"
          required
          type="tel"
          placeholder="Telefon Numarası"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-gold focus:outline-none"
        />
        <select
          name="grade"
          required
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-gold focus:outline-none"
          defaultValue=""
        >
          <option value="" disabled className="text-primary">
            Sınıf Seçiniz
          </option>
          {grades.map((g) => (
            <option key={g} value={g} className="text-primary">
              {g}
            </option>
          ))}
        </select>
        <input type="hidden" name="parentName" value="-" />
        <Button
          type="submit"
          variant="gold"
          className="w-full"
          disabled={loading}
        >
          {loading ? "Gönderiliyor..." : "BİLGİ ALMAK İSTİYORUM"}
        </Button>
        <p className="text-center text-xs text-white/50">
          Veya hemen bizi arayın:{" "}
          <a href="tel:+902125550123" className="text-gold">
            0212 555 01 23
          </a>
        </p>
      </form>
    </div>
  );
}
