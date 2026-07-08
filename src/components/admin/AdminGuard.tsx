"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/admin/AuthProvider";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isConfigured) return;
      if (!user) router.replace("/admin/login");
    }
  }, [user, loading, isConfigured, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-gray">
        <p className="text-slate-text">Yükleniyor...</p>
      </div>
    );
  }

  if (isConfigured && !user) return null;

  return <>{children}</>;
}
