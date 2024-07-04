import type { ConnectionArguments } from '~/shopify/graphql/types'
import { getConnectionArguments } from '~/shopify/graphql/fns.server'
import { PAGE_INFO_SELECTION } from '~/shopify/graphql/constants.server'
import {
  PRODUCT_LIST_FIELD_SELECTION,
  PRODUCT_VARIANT_QUERY_FIELD_SELECTION,
} from '~/shopify/graphql/products/constants.server'

/**
 * Generate a GraphQL query for retrieving a list of Shopify products.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/queries/products
 *
 * @param {object} params An object that specifies ProductConnection arguments
 *
 * @returns {string}
 */
export function queryForProducts(params: ConnectionArguments = {}): string {
  return `
    query {
      products(${getConnectionArguments(params).join(', ')}) {
        ${PRODUCT_LIST_FIELD_SELECTION}
        ${PAGE_INFO_SELECTION}
      }
    }`
}

/**
 * Generate a GraphQL query for retrieving a list of Shopify product variants.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/queries/productvariants
 *
 * @param {object} params An object that specifies ProductVariantConnection arguments
 *
 * @returns {string}
 */
export function queryForProductVariants(params: ConnectionArguments = {}): string {
  return `
    query {
      productVariants(${getConnectionArguments(params).join(', ')}) {
        ${PRODUCT_VARIANT_QUERY_FIELD_SELECTION}
        ${PAGE_INFO_SELECTION}
      }
    }`
}
