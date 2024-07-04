import { ITEM_LIST_LIMITATION } from '~/constants'
import { COUNT_FIELD_SELECTION, IMAGE_FIELD_SELECTION, PRICE_FIELD_SELECTION } from '../constants.server'

export const PRODUCT_LIST_FIELD_SELECTION = `
  nodes {
    id
    tags
    title
    handle
    status
    vendor
    createdAt
    updatedAt
    publishedAt
    productType
    description
    onlineStoreUrl
    templateSuffix
    totalInventory
    tracksInventory
    legacyResourceId
    requiresSellingPlan
    hasOnlyDefaultVariant
    hasOutOfStockVariants
    onlineStorePreviewUrl
    totalVariants
    seo {
      title
      description
    }
    category {
      name
      fullName
    }
    mediaCount {
      ${COUNT_FIELD_SELECTION}
    }
    featuredImage {
      ${IMAGE_FIELD_SELECTION}
    }
    featuredMedia {
      alt
      preview {
        image {
          ${IMAGE_FIELD_SELECTION}
        }
      }
    }
    variantsCount {
      ${COUNT_FIELD_SELECTION}
    }
    priceRangeV2 {
      maxVariantPrice {
        ${PRICE_FIELD_SELECTION}
      }
      minVariantPrice {
        ${PRICE_FIELD_SELECTION}
      }
    }
    compareAtPriceRange {
      maxVariantCompareAtPrice {
        ${PRICE_FIELD_SELECTION}
      }
      minVariantCompareAtPrice {
        ${PRICE_FIELD_SELECTION}
      }
    }
    sellingPlanGroupsCount {
      ${COUNT_FIELD_SELECTION}
    }
    variants(first: ${ITEM_LIST_LIMITATION}) {
      nodes {
        id
        price
        title
        displayName
        legacyResourceId
        image {
          ${IMAGE_FIELD_SELECTION}
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }`

export const PRODUCT_VARIANT_QUERY_FIELD_SELECTION = `
  nodes {
    id
    product {
      id
      title
      handle
      totalVariants
      featuredImage {
        ${IMAGE_FIELD_SELECTION}
      }
      variants(first: ${ITEM_LIST_LIMITATION}) {
        nodes {
          id
        }
      }
    }
  }`
