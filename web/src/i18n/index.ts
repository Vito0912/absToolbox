import { en, type Translations } from "./en";

const currentLocale = "en";

const translations: Record<string, Translations> = {
  en,
};

/**
 * Get the current translations object
 */
export const useI18n = () => {
  return translations[currentLocale];
};

/**
 * Simple helper to replace placeholders in strings
 * Example: t('Hello {name}', { name: 'World' }) => 'Hello World'
 *
 * If anyone reading this has a better idea for the implementation, please suggest!
 */
export const interpolate = (
  text: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return text;

  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
  }, text);
};

export type { Translations };
