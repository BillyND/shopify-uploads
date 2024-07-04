import type { ActionFunctionArgs } from '@remix-run/node'
import Shop from '~/models/Shop'
import ShopifySession from '~/models/ShopifySession'
import WebhookLog from '~/models/WebhookLog'
import { authenticate } from '~/shopify.server'
import { ShopifyApiClient } from '~/shopify/graphql/api.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop: shopDomain, admin, payload } = await authenticate.webhook(request)

  // Log webhook payload to app database for debugging easier when needed
  await WebhookLog.create({ topic, payload, shopDomain, admin: admin ? 'AUTHENTICATED' : 'UNAUTHENTICATED' })

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response()
  }

  // Get Shopify API client
  const api = topic !== 'APP_UNINSTALLED' && new ShopifyApiClient(admin)

  try {
    switch (topic) {
      case 'APP_UNINSTALLED': {
        // Clear all shop sessions
        await ShopifySession.deleteMany({ shop: shopDomain })

        // Mark shop as uninstalled and clear shop config in the `shops` collection
        await Shop.updateOne({ shopDomain }, { shopConfig: null, uninstalledAt: new Date() })

        break
      }

      default: {
        console.log('===> Unhandled webhook topic', topic)
        break
      }
    }
  } catch (e) {
    console.error(e)

    if (e instanceof Response) {
      throw e
    }
  }

  throw new Response()
}
