interface Locale {
  [index: string]: string;
}

declare module "*.json" {
  export interface LocaleData {
    [index: string]: Locale;
  }

  export const en: Locale;
  export const es: Locale;
}
