import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { authenticate } from '~/shopify.server'
import { ShopifyApiClient } from '~/shopify/graphql/api.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Authenticate and get the liquid processing function
  const { liquid } = await authenticate.public.appProxy(request)

  return liquid(`hello`)
}

export async function action({ request }: ActionFunctionArgs) {
  const res = await authenticate.public.appProxy(request)
  const { admin, session } = res || {}

  if (!admin) {
    // If admin authentication fails, return unsuccessful response
    return { success: false, message: 'Admin authentication fails!' }
  }

  // Initialize Shopify API client
  const shopifyApiClient = new ShopifyApiClient(admin)

  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
}
