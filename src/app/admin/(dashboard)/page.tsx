"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminSidebar";
import {
  getClassSections,
  getCourses,
  getRegistrations,
  getStudents,
} from "@/lib/firebase/firestore";
import type { Course, Registration } from "@/lib/types";
import { ClipboardList, Pencil, School, Users } from "lucide-react";

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [studentCount, setStudentCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  useEffect(() => {
    getCourses().then(setCourses);
    getRegistrations().then(setRegistrations);
    getStudents().then((students) => setStudentCount(students.length));
    getClassSections().then((sections) => setClassCount(sections.length));
  }, []);

  const newRegistrations = registrations.filter((r) => r.status === "new").length;

  const stats = [
    {
      label: "Yeni Başvuru",
      value: newRegistrations.toString(),
      badge: newRegistrations > 0 ? "İncele" : "Güncel",
      icon: ClipboardList,
      color: "text-accent-orange",
      bar: "bg-accent-orange",
      href: "/admin/basvurular",
    },
    {
      label: "Kayıtlı Öğrenci",
      value: studentCount.toString(),
      badge: "CRM",
      icon: Users,
      color: "text-primary",
      bar: "bg-primary",
      href: "/admin/ogrenciler",
    },
    {
      label: "Sınıf Grubu",
      value: classCount.toString(),
      badge: "Atama",
      icon: School,
      color: "text-gold",
      bar: "bg-gold",
      href: "/admin/siniflar",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Genel Bakış"
        subtitle="Başvurular, öğrenciler ve sınıf gruplarının özeti."
      />

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-2xl bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
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
            </Link>
          );
        })}
      </div>

      {registrations.length > 0 && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Son Başvurular</h2>
            <Link
              href="/admin/basvurular"
              className="text-sm font-medium text-primary hover:text-gold"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="space-y-3">
            {registrations.slice(0, 5).map((reg) => (
              <div
                key={reg.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-gray/60 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-primary">{reg.studentName}</p>
                  <p className="text-sm text-slate-text">
                    {reg.parentName} · {reg.grade} · {reg.phone}
                  </p>
                </div>
                <p className="text-xs text-slate-text">
                  {new Date(reg.createdAt).toLocaleDateString("tr-TR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-card">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-primary">Kurs Programları</h2>
          <Link
            href="/admin/kurslar"
            className="text-sm font-medium text-primary hover:text-gold"
          >
            Eğitim Programları →
          </Link>
        </div>

        {courses.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-text">
            Henüz program eklenmemiş. Eğitim Programları sayfasından ekleyebilirsiniz.
          </p>
        ) : (
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
                      <Link
                        href={`/admin/kurslar/${course.id}`}
                        className="rounded p-1 text-outline hover:bg-surface-gray hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
