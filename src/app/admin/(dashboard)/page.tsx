"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import { getCourses, getRegistrations } from "@/lib/firebase/firestore";
import type { Course, Registration } from "@/lib/types";
import { BookOpen, Pencil, Search, Trash2, Users } from "lucide-react";

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    getCourses().then(setCourses);
    getRegistrations().then(setRegistrations);
  }, []);

  const stats = [
    {
      label: "Toplam Aktif Öğrenci",
      value: "1,248",
      badge: "+12% Artış",
      icon: Users,
      color: "text-accent-orange",
      bar: "bg-accent-orange",
    },
    {
      label: "Aktif Kurs Programları",
      value: courses.filter((c) => c.status === "active").length.toString(),
      badge: "Stabil",
      icon: BookOpen,
      color: "text-primary",
      bar: "bg-primary",
    },
    {
      label: "Son 30 Gün Kayıt",
      value: registrations.length.toString() || "85",
      badge: "Yeni Başvuru",
      icon: Users,
      color: "text-gold",
      bar: "bg-gold",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Genel Bakış"
        subtitle="Eğitim kurumunuzun güncel özet durumu."
      />

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl bg-white p-6 shadow-card"
            >
              <div className="mb-4 flex items-start justify-between">
                <Icon className={`h-8 w-8 ${stat.color}`} />
                <span className="rounded-full bg-surface-gray px-3 py-1 text-xs font-semibold text-slate-text">
                  {stat.badge}
                </span>
              </div>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-slate-text">{stat.label}</p>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-gray">
                <div className={`h-full w-3/4 rounded-full ${stat.bar}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-primary">Son Eklenen Kurslar</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-outline" />
              <input
                placeholder="Kurs ara..."
                className="rounded-lg border border-outline/20 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-outline/10 text-xs uppercase text-outline">
                <th className="pb-3 pr-4">Kurs Adı</th>
                <th className="pb-3 pr-4">Kategori</th>
                <th className="pb-3 pr-4">Durum</th>
                <th className="pb-3">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {courses.slice(0, 5).map((course) => (
                <tr key={course.id} className="border-b border-outline/5">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {course.title[0]}
                      </div>
                      <span className="font-medium text-primary">
                        {course.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-slate-text">{course.category}</td>
                  <td className="py-4 pr-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        course.status === "active"
                          ? "bg-gold/20 text-primary"
                          : "bg-surface-gray text-slate-text"
                      }`}
                    >
                      {course.status === "active" ? "Aktif" : "Taslak"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/kurslar/${course.id}`}
                        className="rounded p-1 text-outline hover:bg-surface-gray hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button className="rounded p-1 text-outline hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <Link
            href="/admin/kurslar"
            className="text-sm font-medium text-primary hover:text-gold"
          >
            Tüm Kursları Görüntüle →
          </Link>
        </div>
      </div>
    </>
  );
}
