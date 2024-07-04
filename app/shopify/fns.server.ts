import type { Session } from '@remix-run/node'
import type { Asset } from 'node_modules/@shopify/shopify-api/dist/ts/rest/admin/2024-04/asset'
import type { AdminApiContext } from 'node_modules/@shopify/shopify-app-remix/dist/ts/server/clients'
import lodash from 'lodash'
import { parseJson } from '~/bootstrap/fns/parseJson'
import { queryForAppTitle } from '~/shopify/graphql/app/query.server'

type ThemeSettings = {
  current: {
    blocks: Record<string, { type: string; disabled?: boolean }>
  }
}

export async function isAppBlockEnabledOnDefaultProductTemplate(
  context: { admin: AdminApiContext; session: Session },
  asset?: Asset
) {
  try {
    const settings = JSON.parse(asset?.value || (await getThemeAsset(context, 'templates/product.json'))?.value || '{}')

    // Check if EverFlow app block is enabled
    const { SHOPIFY_EVERFLOW_ID } = process.env

    const block: any = Object.values(settings?.sections?.main?.blocks || {}).find(
      (block: any) => block.type.indexOf(SHOPIFY_EVERFLOW_ID) > -1
    )

    return block ? !block.disabled : false
  } catch (e) {
    console.error(e)
    return false
  }
}

/**
 * Checks if the Everflow theme app extension is enabled.
 * @param context - The context containing admin and session.
 * @returns A boolean indicating if the Everflow theme app extension is enabled.
 */
export async function isThemeAppExtensionEnabled(context: {
  admin: AdminApiContext
  session: Session
}): Promise<boolean> {
  try {
    const settingsAsset = await getThemeAsset(context, 'config/settings_data.json')
    const settings = parseJson<ThemeSettings>(settingsAsset?.value || '{}', { current: { blocks: {} } })
    const SHOPIFY_EVERFLOW_ID = process.env.SHOPIFY_EVERFLOW_ID

    if (!SHOPIFY_EVERFLOW_ID) {
      console.error('SHOPIFY_EVERFLOW_ID is not defined in environment variables')
      return false
    }

    const block = Object.values(settings.current.blocks).find(block =>
      block.type.includes(`manage-subscriptions/${SHOPIFY_EVERFLOW_ID}`)
    )

    return block ? !block.disabled : false
  } catch (error) {
    console.error('Error checking theme app extension:', error)
    return false
  }
}

export async function toggleAppBlockOnDefaultProductTemplate(
  context: { admin: AdminApiContext; session: Session },
  enable: boolean,
  asset?: Asset
): Promise<void> {
  asset = asset || (await getThemeAsset(context, 'templates/product.json'))

  /**
   * The EverFlow app needs to be granted permission to use Shopify's Asset API, which is
   * required to enable/disable the EverFlow extension programmatically. If the permission
   * is lacking, merchants need to add the EverFlow extension manually.
   *
   * @see https://shopify.dev/docs/api/admin-rest/2024-04/resources/asset
   * @see https://shopify.dev/docs/apps/build/online-store/asset-legacy
   */
  const slug = await getAppSlug(context.admin)

  asset.value = JSON.stringify(
    lodash.merge(JSON.parse(asset?.value || '{}'), {
      sections: {
        main: {
          blocks: {
            [slug]: {
              type: `shopify://apps/${slug}/blocks/customize/${process.env.SHOPIFY_EVERFLOW_ID}`,
              disabled: !enable,
              settings: {},
            },
          },
        },
      },
    })
  )

  await asset.save()
}

export async function getDefaultProductTemplate(
  context: { admin: AdminApiContext; session: Session },
  themeId?: string
): Promise<Asset> {
  return getThemeAsset(context, 'templates/product.json', themeId)
}

export async function getThemeAsset(
  context: { admin: AdminApiContext; session: Session },
  assetKey: string,
  themeId?: string
): Promise<Asset> {
  const { admin, session } = context

  // Get theme ID
  themeId = themeId || (await getMainThemeId(context))

  // Get theme asset
  const result = await admin.rest.resources.Asset.all({
    session,
    asset: { key: assetKey },
    theme_id: themeId as string,
  })

  return result.data?.[0]
}

export async function getMainThemeId(context: { admin: AdminApiContext; session: Session }) {
  const { admin, session } = context

  const result = await admin.rest.resources.Theme.all({ session })
  const theme = result.data?.find((theme: any) => theme.role === 'main')

  return theme?.id
}

export async function getAppSlug(admin: AdminApiContext): Promise<string> {
  // Get app info
  const result: any = await (await admin.graphql(queryForAppTitle))?.json()

  return stringToSlug(result?.data?.app?.title)
}

export function stringToSlug(str: string, replacement = '-', replaceInvalid = ''): string {
  str = str.replace(/^\s+|\s+$/g, '').toLowerCase()

  // Remove accents, swap ñ for n, etc.
  const from: string = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to: string = 'aaaaaeeeeiiiioooouuuunc------'

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, replaceInvalid)
    .replace(/\s+/g, '-')
    .replace(/-+/g, replacement)

  return str
}
