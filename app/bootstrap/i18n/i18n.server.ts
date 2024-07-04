import Backend from 'i18next-fs-backend'
import i18nextOptions from '~/bootstrap/i18n/options'
import { resolve } from 'node:path'
import { createCookie } from '@remix-run/node'
import { RemixI18Next } from 'remix-i18next/server'

export const i18nCookie = createCookie('i18n', {
  path: '/',
  secure: true,
  sameSite: 'none',
})

export default new RemixI18Next({
  detection: {
    // Persist language selection in cookie.
    cookie: i18nCookie,
    // List of supports languages.
    supportedLanguages: i18nextOptions.supportedLngs,
    // The default language to use in case the user language is not supported.
    fallbackLanguage: i18nextOptions.fallbackLng,
  },
  // The configuration for `i18next` when translating messages on the server side.
  i18next: {
    backend: { loadPath: resolve('../../../public/locales/{{lng}}/{{ns}}.json') },
  },
  // The backend to load the translations.
  backend: Backend,
})
