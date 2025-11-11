export const defaultLanguage = "en"
export const validLanguages = ['am', 'en', 'ru'] as const;
export type LanguagesType = typeof validLanguages[number];