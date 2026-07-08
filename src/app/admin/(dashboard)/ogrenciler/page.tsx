"use client";

import { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import {
  getRegistrations,
  updateRegistrationStatus,
} from "@/lib/firebase/firestore";
import type { Registration } from "@/lib/types";

export default function StudentsAdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    getRegistrations().then(setRegistrations);
  }, []);

  async function updateStatus(id: string, status: Registration["status"]) {
    try {
      await updateRegistrationStatus(id, status);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch {
      alert("Güncelleme başarısız.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Öğrenci Listesi"
        subtitle="Kayıt başvurularını yönetin."
      />

      {registrations.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-slate-text">
            Henüz kayıt başvurusu yok. Firebase bağlandığında başvurular burada
            görünecek.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-outline/10 bg-surface-gray">
              <tr>
                <th className="px-6 py-4 font-semibold text-primary">Öğrenci</th>
                <th className="px-6 py-4 font-semibold text-primary">Veli</th>
                <th className="px-6 py-4 font-semibold text-primary">Telefon</th>
                <th className="px-6 py-4 font-semibold text-primary">Sınıf</th>
                <th className="px-6 py-4 font-semibold text-primary">Durum</th>
                <th className="px-6 py-4 font-semibold text-primary">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id} className="border-b border-outline/5">
                  <td className="px-6 py-4">{reg.studentName}</td>
                  <td className="px-6 py-4">{reg.parentName}</td>
                  <td className="px-6 py-4">{reg.phone}</td>
                  <td className="px-6 py-4">{reg.grade}</td>
                  <td className="px-6 py-4">
                    <select
                      value={reg.status}
                      onChange={(e) =>
                        updateStatus(
                          reg.id,
                          e.target.value as Registration["status"]
                        )
                      }
                      className="rounded-lg border border-outline/20 px-2 py-1 text-xs"
                    >
                      <option value="new">Yeni</option>
                      <option value="contacted">İletişim Kuruldu</option>
                      <option value="enrolled">Kayıtlı</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-text">
                    {new Date(reg.createdAt).toLocaleDateString("tr-TR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
