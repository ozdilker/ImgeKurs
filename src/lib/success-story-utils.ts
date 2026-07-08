export const SUCCESS_STORY_PLACEHOLDER = "/images/placeholder-person.svg";

export function resolveSuccessStoryImage(url?: string | null): string {
  const trimmed = url?.trim();
  return trimmed || SUCCESS_STORY_PLACEHOLDER;
}
