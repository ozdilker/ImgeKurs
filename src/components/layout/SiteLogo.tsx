import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

type SiteLogoProps = {
  settings: Pick<SiteSettings, "siteName" | "logoUrl">;
  variant?: "header" | "footer";
  link?: boolean;
};

export function SiteLogo({
  settings,
  variant = "header",
  link = true,
}: SiteLogoProps) {
  const isFooter = variant === "footer";
  const logoUrl = settings.logoUrl?.trim();

  const content = logoUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={settings.siteName}
      className={`h-auto w-auto object-contain ${
        isFooter ? "max-h-14 md:max-h-16" : "max-h-12 sm:max-h-14 md:max-h-16 lg:max-h-[4.5rem]"
      }`}
    />
  ) : (
    <span className="flex items-center gap-1">
      <span
        className={`font-bold tracking-tight ${isFooter ? "text-2xl text-white md:text-3xl" : "text-2xl text-primary md:text-3xl"}`}
      >
        {settings.siteName.split(" ")[0] ?? "İMGE"}
      </span>
      {settings.siteName.includes(" ") && (
        <span
          className={`font-bold text-gold ${isFooter ? "text-2xl md:text-3xl" : "text-2xl md:text-3xl"}`}
        >
          {settings.siteName.split(" ").slice(1).join(" ")}
        </span>
      )}
    </span>
  );

  if (!link) return content;

  return (
    <Link href="/" className="inline-flex shrink-0 items-center">
      {content}
    </Link>
  );
}
