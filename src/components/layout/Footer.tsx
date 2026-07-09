import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { SiteLogo } from "@/components/layout/SiteLogo";
import type { SiteSettings } from "@/lib/types";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-primary text-white">
      <div className="container-main section-padding pb-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4">
              <SiteLogo settings={settings} variant="footer" />
            </div>
            <p className="text-sm leading-relaxed text-white/70">
              {settings.tagline}. Bahçelievler&apos;in güvenilir eğitim merkezi
              olarak öğrencilerimizi geleceğe hazırlıyoruz.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/sayfa/hakkimizda" className="hover:text-gold">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/egitimlerimiz" className="hover:text-gold">
                  Eğitimlerimiz
                </Link>
              </li>
              <li>
                <Link href="/basarilarimiz" className="hover:text-gold">
                  Başarılarımız
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-gold">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gold">
              İletişim
            </h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {settings.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                {settings.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                {settings.email}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-primary-container py-4">
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} Bahçelievler İmge Eğitim Kurumları. Tüm
          Hakları Saklıdır.
        </p>
      </div>
    </footer>
  );
}
