import { SELLING_PLAN_GROUP_FIELD_SELECTION } from './constants.server'

/**
 * GraphQL mutation to create a new selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupCreate
 *
 * @returns {string}
 */
export const mutationCreateSellingPlanGroup = `
  mutation createSellingPlanGroup($input: SellingPlanGroupInput!, $resources: SellingPlanGroupResourceInput) {
    sellingPlanGroupCreate(input: $input, resources: $resources) {
      ${SELLING_PLAN_GROUP_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to update an existing selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupUpdate
 *
 * @returns {string}
 */
export const mutationSellingPlanGroupUpdate = `
  mutation sellingPlanGroupUpdate($id: ID!, $input: SellingPlanGroupInput!) {
    sellingPlanGroupUpdate(id: $id, input: $input) {
      ${SELLING_PLAN_GROUP_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to delete a selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupDelete
 *
 * @returns {string}
 */
export const mutationSellingPlanGroupDelete = `
  mutation sellingPlanGroupDelete($id: ID!) {
    sellingPlanGroupDelete(id: $id) {
      deletedSellingPlanGroupId
      userErrors {
        field
        message
      }
    }
  }`

/**
 * GraphQL mutation to add products to a selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupAddProducts
 *
 * @returns {string}
 */
export const mutationSellingPlanGroupAddProducts = `
  mutation sellingPlanGroupAddProducts($id: ID!, $productIds: [ID!]!) {
    sellingPlanGroupAddProducts(id: $id, productIds: $productIds) {
      ${SELLING_PLAN_GROUP_FIELD_SELECTION}
      userErrors {
        field
        message
      }
    }
  }`

/**
 * GraphQL mutation to add product variants to a selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupAddProductVariants
 *
 * @returns {string}
 */
export const mutationSellingPlanGroupAddProductVariants = `
  mutation sellingPlanGroupAddProductVariants($id: ID!, $productVariantIds: [ID!]!) {
    sellingPlanGroupAddProductVariants(id: $id, productVariantIds: $productVariantIds) {
      ${SELLING_PLAN_GROUP_FIELD_SELECTION}
      userErrors {
        field
        message
      }
    }
  }`

/**
 * GraphQL mutation to remove products from a selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupRemoveProducts
 *
 * @returns {string}
 */
export const mutationSellingPlanGroupRemoveProducts = `
  mutation sellingPlanGroupRemoveProducts($id: ID!, $productIds: [ID!]!) {
    sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {
      removedProductIds
      userErrors {
        field
        message
      }
    }
  }`

/**
 * GraphQL mutation to remove product variants from a selling plan group.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/sellingPlanGroupRemoveProductVariants
 *
 * @returns {string}
 */
export const mutationSellingPlanGroupRemoveProductVariants = `
  mutation sellingPlanGroupRemoveProductVariants($id: ID!, $productVariantIds: [ID!]!) {
    sellingPlanGroupRemoveProductVariants(id: $id, productVariantIds: $productVariantIds) {
      removedProductVariantIds
      userErrors {
        field
        message
      }
    }
  }`
