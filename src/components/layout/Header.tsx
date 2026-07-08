"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { buildMainNav } from "@/lib/courses";
import type { SiteSettings } from "@/lib/types";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

type HeaderProps = {
  settings: Pick<SiteSettings, "siteName" | "logoUrl">;
  courseMenuItems: { label: string; href: string }[];
};

export function Header({ settings, courseMenuItems }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navItems = buildMainNav(courseMenuItems);

  const isNavItemActive = (item: (typeof navItems)[number]) => {
    if (item.href === "/") return pathname === "/";
    if (item.href === "#") return false;

    if (item.label === "Eğitim Programı") {
      return pathname === "/egitim-programi";
    }

    if (item.children?.length) {
      const childActive = item.children.some(
        (child) =>
          pathname === child.href || pathname.startsWith(`${child.href}/`)
      );
      if (childActive) return true;

      if (item.label === "Eğitimlerimiz") {
        return pathname.startsWith("/egitim-detay");
      }
    }

    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline/10 bg-white/95 backdrop-blur-md">
      <div className="container-main flex h-16 items-center justify-between md:h-20">
        <SiteLogo settings={settings} variant="header" />

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors",
                    isNavItemActive(item)
                      ? "text-gold"
                      : "text-slate-text hover:text-primary"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute left-0 top-full min-w-[220px] rounded-lg border border-outline/10 bg-white py-2 shadow-card">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-text hover:bg-surface-gray hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium transition-colors",
                  isNavItemActive(item)
                    ? "text-gold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-gold"
                    : "text-slate-text hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Link href="/iletisim">
            <Button size="sm">Kayıt Ol</Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-primary lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-outline/10 bg-white px-4 py-4 lg:hidden">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-outline/5 py-2">
              {item.children ? (
                <>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-outline">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block py-2 pl-2 text-sm text-slate-text"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link
                  href={item.href}
                  className="block py-2 text-sm font-medium text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <Link href="/iletisim" className="mt-4 block" onClick={() => setMobileOpen(false)}>
            <Button className="w-full" size="sm">
              Kayıt Ol
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
