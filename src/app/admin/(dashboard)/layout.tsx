"use client";

import { AuthProvider } from "@/components/admin/AuthProvider";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="flex min-h-screen bg-surface-gray">
          <AdminSidebar />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
      </AdminGuard>
    </AuthProvider>
  );
}
