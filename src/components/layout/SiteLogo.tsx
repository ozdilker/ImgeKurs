import Image from "next/image";
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
  const height = isFooter ? 48 : 40;

  const content = settings.logoUrl ? (
    settings.logoUrl.startsWith("data:") ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={settings.logoUrl}
        alt={settings.siteName}
        className={`h-auto w-auto object-contain ${isFooter ? "max-h-12" : "max-h-10 md:max-h-12"}`}
      />
    ) : (
      <Image
        src={settings.logoUrl}
        alt={settings.siteName}
        width={160}
        height={height}
        className={`h-auto w-auto object-contain ${isFooter ? "max-h-12" : "max-h-10 md:max-h-12"}`}
        priority={variant === "header"}
      />
    )
  ) : (
    <span className="flex items-center gap-1">
      <span
        className={`font-bold tracking-tight ${isFooter ? "text-2xl text-white" : "text-xl text-primary md:text-2xl"}`}
      >
        {settings.siteName.split(" ")[0] ?? "İMGE"}
      </span>
      {settings.siteName.includes(" ") && (
        <span
          className={`font-bold text-gold ${isFooter ? "text-2xl" : "text-xl md:text-2xl"}`}
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
