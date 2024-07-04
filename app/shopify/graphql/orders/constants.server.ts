import { ITEM_LIST_LIMITATION } from '~/constants'
import { CUSTOMER_FIELD_SELECTION } from '../customers/constants.server'
import {
  MAILING_ADDRESS_FIELD_SELECTION,
  CUSTOM_ATTRIBUTES_FIELD_SELECTION,
  PRICE_SET_FIELD_SELECTION,
} from '../constants.server'

export const ORDER_FIELD_SELECTION = `
  id
  name
  note
  test
  closedAt
  createdAt
  updatedAt
  processedAt
  currencyCode
  discountCode
  discountCodes
  legacyResourceId
  paymentGatewayNames
  displayFinancialStatus
  presentmentCurrencyCode
  displayFulfillmentStatus
  ${CUSTOM_ATTRIBUTES_FIELD_SELECTION}
  customer {
    ${CUSTOMER_FIELD_SELECTION}
  }
  netPaymentSet {
    ${PRICE_SET_FIELD_SELECTION}
  }
  originalTotalPriceSet {
    ${PRICE_SET_FIELD_SELECTION}
  }
  subtotalPriceSet {
    ${PRICE_SET_FIELD_SELECTION}
  }
  totalPriceSet {
    ${PRICE_SET_FIELD_SELECTION}
  }
  totalReceivedSet {
    ${PRICE_SET_FIELD_SELECTION}
  }
  totalRefundedSet {
    ${PRICE_SET_FIELD_SELECTION}
  }
  billingAddress {
    ${MAILING_ADDRESS_FIELD_SELECTION}
  }
  shippingAddress {
    ${MAILING_ADDRESS_FIELD_SELECTION}
  }
  lineItems(first: ${ITEM_LIST_LIMITATION}) {
    nodes {
      id
      name
      title
      quantity
      variantTitle
      currentQuantity
      ${CUSTOM_ATTRIBUTES_FIELD_SELECTION}
      originalTotalSet {
        ${PRICE_SET_FIELD_SELECTION}
      }
      originalUnitPriceSet {
        ${PRICE_SET_FIELD_SELECTION}
      }
      contract {
        id
        app {
          id
        }
      }
      product {
        id
        title
        featuredImage {
          url
        }
      }
      variant {
        id
        title
        displayName
      }
      sellingPlan {
        name
        sellingPlanId
      }
    }
  }`
