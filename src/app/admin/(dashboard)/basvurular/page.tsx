"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import {
  createStudentFromRegistration,
  deleteRegistration,
  getRegistrations,
  updateRegistrationStatus,
} from "@/lib/firebase/firestore";
import type { Registration } from "@/lib/types";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  RefreshCw,
  Trash2,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusLabels: Record<Registration["status"], string> = {
  new: "Yeni",
  contacted: "İletişim Kuruldu",
  enrolled: "Kayıtlı",
};

const statusStyles: Record<Registration["status"], string> = {
  new: "bg-accent-orange/15 text-accent-orange",
  contacted: "bg-primary/10 text-primary",
  enrolled: "bg-gold/20 text-primary",
};

const sourceLabels: Record<NonNullable<Registration["source"]>, string> = {
  contact: "İletişim Formu",
  "pre-registration": "Ön Kayıt",
};

type StatusFilter = "all" | Registration["status"];

export default function RegistrationsAdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRegistrations();
      setRegistrations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRegistrations();
  }, [loadRegistrations]);

  const stats = useMemo(
    () => ({
      total: registrations.length,
      new: registrations.filter((r) => r.status === "new").length,
      contacted: registrations.filter((r) => r.status === "contacted").length,
      enrolled: registrations.filter((r) => r.status === "enrolled").length,
    }),
    [registrations]
  );

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? registrations
        : registrations.filter((r) => r.status === statusFilter),
    [registrations, statusFilter]
  );

  async function updateStatus(id: string, status: Registration["status"]) {
    try {
      await updateRegistrationStatus(id, status);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch {
      alert("Durum güncellenemedi.");
    }
  }

  async function handleConvert(reg: Registration) {
    if (reg.convertedStudentId) {
      alert("Bu başvuru zaten öğrenci kaydına dönüştürülmüş.");
      return;
    }
    setConvertingId(reg.id);
    try {
      const studentId = await createStudentFromRegistration(reg);
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === reg.id
            ? { ...r, status: "enrolled", convertedStudentId: studentId }
            : r
        )
      );
    } catch {
      alert("Öğrenci kaydı oluşturulamadı.");
    } finally {
      setConvertingId(null);
    }
  }

  async function handleDelete(id: string, studentName: string) {
    if (!confirm(`"${studentName}" başvurusunu silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await deleteRegistration(id);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      alert("Başvuru silinemedi.");
    }
  }

  return (
    <>
      <AdminHeader
        title="Kayıt Başvuruları"
        subtitle="İletişim formundan gelen başvuruları yönetin ve öğrenci kaydına dönüştürün."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Toplam Başvuru", value: stats.total, color: "text-primary" },
          { label: "Yeni", value: stats.new, color: "text-accent-orange" },
          { label: "İletişim Kuruldu", value: stats.contacted, color: "text-primary" },
          { label: "Kayıtlı", value: stats.enrolled, color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-card">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-text">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { key: "all", label: "Tümü" },
              { key: "new", label: "Yeni" },
              { key: "contacted", label: "İletişim Kuruldu" },
              { key: "enrolled", label: "Kayıtlı" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatusFilter(filter.key)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                statusFilter === filter.key
                  ? "bg-primary text-white"
                  : "bg-white text-slate-text shadow-card hover:text-primary"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={loadRegistrations}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-primary shadow-card hover:bg-surface-gray disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Yenile
        </button>
      </div>

      {loading && registrations.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-slate-text">Başvurular yükleniyor...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-card">
          <p className="text-lg font-semibold text-primary">Henüz başvuru yok</p>
          <p className="mt-2 text-sm text-slate-text">
            İletişim sayfasındaki form doldurulduğunda başvurular burada görünür.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((reg) => {
            const expanded = expandedId === reg.id;
            return (
              <div
                key={reg.id}
                className="overflow-hidden rounded-2xl bg-white shadow-card"
              >
                <div className="flex flex-wrap items-center gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-primary">{reg.studentName}</p>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                          statusStyles[reg.status]
                        )}
                      >
                        {statusLabels[reg.status]}
                      </span>
                      {reg.source && (
                        <span className="rounded-full bg-surface-gray px-2.5 py-0.5 text-xs text-slate-text">
                          {sourceLabels[reg.source]}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-text">
                      Veli: {reg.parentName} · {reg.grade}
                      {reg.school ? ` · ${reg.school}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`tel:${reg.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 text-sm text-primary hover:text-accent-orange"
                    >
                      <Phone className="h-4 w-4" />
                      {reg.phone}
                    </a>
                    {reg.email && (
                      <a
                        href={`mailto:${reg.email}`}
                        className="flex items-center gap-1.5 text-sm text-primary hover:text-accent-orange"
                      >
                        <Mail className="h-4 w-4" />
                        {reg.email}
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!reg.convertedStudentId && (
                      <button
                        type="button"
                        onClick={() => handleConvert(reg)}
                        disabled={convertingId === reg.id}
                        className="flex items-center gap-1 rounded-lg bg-gold/20 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-gold/30 disabled:opacity-50"
                        title="Öğrenci kaydı oluştur"
                      >
                        <UserPlus className="h-4 w-4" />
                        {convertingId === reg.id ? "..." : "Öğrenci Yap"}
                      </button>
                    )}
                    {reg.convertedStudentId && (
                      <Link
                        href="/admin/ogrenciler"
                        className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"
                      >
                        Öğrenci Kaydı
                      </Link>
                    )}
                    <select
                      value={reg.status}
                      onChange={(e) =>
                        updateStatus(reg.id, e.target.value as Registration["status"])
                      }
                      className="rounded-lg border border-outline/20 px-3 py-1.5 text-sm"
                    >
                      <option value="new">Yeni</option>
                      <option value="contacted">İletişim Kuruldu</option>
                      <option value="enrolled">Kayıtlı</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : reg.id)}
                      className="rounded-lg p-2 text-slate-text hover:bg-surface-gray hover:text-primary"
                    >
                      {expanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(reg.id, reg.studentName)}
                      className="rounded-lg p-2 text-slate-text hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t border-outline/10 bg-surface-gray/50 px-5 py-4">
                    <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <dt className="font-medium text-primary">Öğrenci</dt>
                        <dd className="text-slate-text">{reg.studentName}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-primary">Veli</dt>
                        <dd className="text-slate-text">{reg.parentName}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-primary">Sınıf Seviyesi</dt>
                        <dd className="text-slate-text">{reg.grade}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-primary">Okul</dt>
                        <dd className="text-slate-text">{reg.school || "—"}</dd>
                      </div>
                      <div>
                        <dt className="font-medium text-primary">Başvuru Tarihi</dt>
                        <dd className="text-slate-text">
                          {new Date(reg.createdAt).toLocaleString("tr-TR")}
                        </dd>
                      </div>
                    </dl>
                    {reg.notes && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-primary">Notlar</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-text">
                          {reg.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
