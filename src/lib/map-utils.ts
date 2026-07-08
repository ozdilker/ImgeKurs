/** Google Maps embed src URL'sini iframe HTML'inden veya ham linkten çıkarır. */
export function normalizeMapEmbedUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  if (srcMatch?.[1]) return srcMatch[1];

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return trimmed;
}

export function isValidMapEmbedUrl(url: string): boolean {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return (
      parsed.hostname.includes("google.com") &&
      (parsed.pathname.includes("/maps/embed") ||
        parsed.pathname.includes("/maps/") ||
        parsed.searchParams.has("pb"))
    );
  } catch {
    return false;
  }
}
