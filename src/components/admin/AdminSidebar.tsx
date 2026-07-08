"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  Image,
  LayoutDashboard,
  LogOut,
  School,
  Settings,
  Trophy,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "../ui/Button";

const navItems = [
  { label: "Panel", href: "/admin", icon: LayoutDashboard },
  { label: "Kayıt Başvuruları", href: "/admin/basvurular", icon: ClipboardList },
  { label: "Öğrenci Yönetimi", href: "/admin/ogrenciler", icon: Users },
  { label: "Sınıf Yönetimi", href: "/admin/siniflar", icon: School },
  { label: "Kurs Yönetimi", href: "/admin/kurslar", icon: GraduationCap },
  { label: "Başarı Hikayeleri", href: "/admin/basarilar", icon: Trophy },
  { label: "Galeri Ayarları", href: "/admin/galeri", icon: Image },
  { label: "Sayfa Yönetimi", href: "/admin/sayfalar", icon: FileText },
  { label: "Site Ayarları", href: "/admin/ayarlar", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.push("/admin/login");
  }

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-[#0f2e46] text-white min-h-screen">
      <div className="border-b border-white/10 p-6">
        <h1 className="text-lg font-bold">İmge Yönetim</h1>
        <p className="text-xs text-white/50">Admin Paneli</p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-orange text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/admin/kurslar/yeni">
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-accent-orange text-white hover:bg-accent-orange/90"
          >
            <BookOpen className="h-4 w-4" />
            Yeni Kurs Ekle
          </Button>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

export function AdminHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-primary">{title}</h1>
        {subtitle && <p className="text-sm text-slate-text">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 rounded-lg bg-gold/10 px-4 py-2 text-sm text-primary">
        <span>📅</span>
        {new Date().toLocaleDateString("tr-TR", {
          month: "long",
          year: "numeric",
        })}{" "}
        Dönemi
      </div>
    </div>
  );
}
