import type { WebhookHandler } from '@shopify/shopify-api'
import '@shopify/shopify-app-remix/adapters/node'
import Shop from '~/models/Shop'
import { restResources } from '@shopify/shopify-api/rest/admin/2024-04'
import { MongooseSessionStorage } from '~/bootstrap/db/session-storage.server'
import { ApiVersion, AppDistribution, DeliveryMethod, shopifyApp } from '@shopify/shopify-app-remix/server'

const webhookHandler: WebhookHandler = {
  deliveryMethod: DeliveryMethod.Http,
  callbackUrl: '/webhooks',
}

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
  apiVersion: ApiVersion.April24,
  scopes: process.env.SCOPES?.split(','),
  appUrl: process.env.SHOPIFY_APP_URL || '',
  authPathPrefix: '/auth',
  sessionStorage: new MongooseSessionStorage(),
  distribution: AppDistribution.AppStore,
  restResources,
  webhooks: {
    APP_UNINSTALLED: webhookHandler,
    CUSTOMERS_DATA_REQUEST: webhookHandler,
    CUSTOMERS_REDACT: webhookHandler,
    CUSTOMERS_UPDATE: webhookHandler,
    SHOP_REDACT: webhookHandler,
    SHOP_UPDATE: webhookHandler,
    ORDERS_DELETE: webhookHandler,
    ORDERS_UPDATED: webhookHandler,
    ORDERS_CANCELLED: webhookHandler,
    PRODUCTS_DELETE: webhookHandler,
    SUBSCRIPTION_CONTRACTS_CREATE: webhookHandler,
    SUBSCRIPTION_CONTRACTS_UPDATE: webhookHandler,
  },
  hooks: {
    afterAuth: async ({ admin, session }) => {
      shopify.registerWebhooks({ session })

      // Request shop data and then save to the `shops` collection
      const { shop: shopDomain } = session
      const existed = await Shop.findOne({ shopDomain })

      if (!existed || existed.shopConfig === null) {
        const data = (await admin.rest.resources.Shop.all({ session }))?.data?.[0]

        if (data) {
          await Shop.updateOne({ shopDomain }, { shopConfig: data, uninstalledAt: null }, { upsert: true })
        }
      }
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    v3_lineItemBilling: true,
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
})

export default shopify
export const apiVersion = ApiVersion.April24
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders
export const authenticate = shopify.authenticate
export const unauthenticated = shopify.unauthenticated
export const login = shopify.login
export const registerWebhooks = shopify.registerWebhooks
export const sessionStorage = shopify.sessionStorage
