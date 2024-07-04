import type { HeadersFunction, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useRouteError,
  useRouteLoaderData,
} from '@remix-run/react'
import { Box } from '@shopify/polaris'
import { AppProvider } from '@shopify/shopify-app-remix/react'
import { boundary } from '@shopify/shopify-app-remix/server'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useChangeLanguage } from 'remix-i18next/react'
import { onLCP } from 'web-vitals'
import { publicPages } from '~/bootstrap/app-config'
import remixI18n, { i18nCookie } from '~/bootstrap/i18n/i18n.server'
import linkStyles from '~/bootstrap/styles'
import BlockLoading from '~/components/loading/BlockLoading'
import { globalConfigStore } from '~/constants/store'
import { authenticate } from '~/shopify.server'
import { authenticatedFetch } from '~/shopify/fns.client'

export const links = () => [...linkStyles()]

export const headers: HeadersFunction = headersArgs => {
  return boundary.headers(headersArgs)
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url)

  if (!publicPages.includes(url.pathname)) {
    await authenticate.admin(request)
  }

  // Detect locale from the request in the following order:
  //
  // 1. The `lng` query param in the requested URL.
  // 2. The `i18n` cookie is sent along with the request.
  // 3. The `Accept-Language` header.
  const locale = await remixI18n.getLocale(request)

  const { SHOPIFY_API_KEY, SHOPIFY_PARTNER_ID, CRISP_WEBSITE_ID } = process.env

  return json(
    {
      params,
      locale,
      apiKey: SHOPIFY_API_KEY,
      crispWebsiteId: CRISP_WEBSITE_ID || '',
      shopifyPartnerId: SHOPIFY_PARTNER_ID || '',
    },
    {
      headers: { 'Set-Cookie': await i18nCookie.serialize(locale) },
    }
  )
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>('root')
}

export const handle = {
  // Define `i18n` namespaces our route need to use.
  i18n: ['index'],
}

export default function App() {
  const { i18n } = useTranslation()
  const { apiKey, locale } = useLoaderData<typeof loader>()

  const navigation = useNavigation()
  const isLoadingPage = navigation.state !== 'idle'

  // This hook will change the `i18n` instance language to the current locale detected by the
  // loader. This way, the locale will change when we change the language, and `i18next` will
  // load the correct translation files.
  useChangeLanguage(locale)

  const initShopConfig = async () => {
    globalConfigStore.setState(prev => ({ ...prev, fetchingConfig: true }))

    const allConfig = (await authenticatedFetch(`/api/config?type=allConfig`).catch(console.error)) || {}

    allConfig && globalConfigStore.setState(prev => ({ ...prev, ...allConfig, fetchingConfig: false }))
  }

  useEffect(() => {
    initShopConfig()
    onLCP(message => console.log(message))
  }, [])

  return (
    <html lang={i18n.language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link rel="stylesheet" href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProvider isEmbeddedApp apiKey={apiKey as string}>
          <div style={{ display: isLoadingPage ? 'none' : undefined }}>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
          </div>

          {isLoadingPage && <BlockLoading />}

          <Box padding={'1600'} />
        </AppProvider>

        <LiveReload />
      </body>
    </html>
  )
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError())
}
