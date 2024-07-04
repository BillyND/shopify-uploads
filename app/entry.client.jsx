import i18next from 'i18next'
import Backend from 'i18next-http-backend'
import i18nextOptions from './bootstrap/i18n/options'
import LanguageDetector from 'i18next-browser-languagedetector'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'
import { getInitialNamespaces } from 'remix-i18next/client'
import { I18nextProvider, initReactI18next } from 'react-i18next'

// Prevent `i18next` from being initialized more than one time.
if (!i18next.isInitialized) {
  i18next
    // Tell `i18next` to use the `react-i18next` plugin.
    .use(initReactI18next)
    // Setup a client-side language detector.
    .use(LanguageDetector)
    // Setup the backend translation loader.
    .use(Backend)
    .init({
      ...i18nextOptions,
      backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
      // Detects the namespaces the routes are rendered on the server side.
      ns: getInitialNamespaces(),
      detection: {
        // Enable only `htmlTag` detection because we will detect the language on the
        // server side with `remix-i18next`. Using the `<html lang>` attribute, we can
        // pass the language detected on the server side to the client.
        order: ['htmlTag'],
        // Because we only use `htmlTag`, disable caching the language on the browser.
        caches: [],
      },
    })
    .then(() => {
      // Wrap app in the `I18nextProvider` component.
      return hydrateRoot(
        document,
        <I18nextProvider i18n={i18next}>
          <RemixBrowser />
        </I18nextProvider>
      )
    })
}
