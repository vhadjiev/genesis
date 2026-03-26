import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { defaultLocale, type Locale } from './settings';

const initI18next = async (locale: Locale, namespace: string = 'common') => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, ns: string) =>
          import(`@/data/locales/${language}/${ns}.json`)
      )
    )
    .init({
      supportedLngs: ['en', 'bg'],
      fallbackLng: defaultLocale,
      lng: locale,
      fallbackNS: 'common',
      defaultNS: namespace,
      ns: [namespace],
    });
  return i18nInstance;
};

export async function getTranslation(locale: Locale, namespace: string = 'common') {
  const i18nextInstance = await initI18next(locale, namespace);
  return {
    t: i18nextInstance.getFixedT(locale, namespace),
    i18n: i18nextInstance,
  };
}
