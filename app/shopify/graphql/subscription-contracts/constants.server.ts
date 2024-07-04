import { ORDER_FIELD_SELECTION } from '../orders/constants.server'
import { CUSTOMER_FIELD_SELECTION } from '../customers/constants.server'
import {
  BILLING_POLICY_FIELD_SELECTION,
  COUNT_FIELD_SELECTION,
  CUSTOMER_PAYMENT_METHOD_FIELD_SELECTION,
  CUSTOM_ATTRIBUTES_FIELD_SELECTION,
  DELIVERY_POLICY_FIELD_SELECTION,
  PRICE_FIELD_SELECTION,
  USER_ERROR_SELECTION,
} from '~/shopify/graphql/constants.server'

export const SUBSCRIPTION_CONTRACT_FIELD_SELECTION = `
  id
  note
  status
  createdAt
  updatedAt
  revisionId
  appAdminUrl
  currencyCode
  nextBillingDate
  lastPaymentStatus
  ${CUSTOM_ATTRIBUTES_FIELD_SELECTION}
  app {
    id
  }
  customer {
    ${CUSTOMER_FIELD_SELECTION}
  }
  linesCount {
    ${COUNT_FIELD_SELECTION}
  }
  originOrder {
    ${ORDER_FIELD_SELECTION}
  }
  billingPolicy {
    ${BILLING_POLICY_FIELD_SELECTION}
  }
  deliveryPrice {
    ${PRICE_FIELD_SELECTION}
  }
  deliveryPolicy {
    ${DELIVERY_POLICY_FIELD_SELECTION}
  }
  customerPaymentMethod {
    ${CUSTOMER_PAYMENT_METHOD_FIELD_SELECTION}
  }`

export const SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION = `
  contract {
    ${SUBSCRIPTION_CONTRACT_FIELD_SELECTION}
  }
  ${USER_ERROR_SELECTION}`

export const SUBSCRIPTION_CONTRACT_DRAFT_FIELD_SELECTION = `
  draft {
    id
    note
    status
    currencyCode
    nextBillingDate
    ${CUSTOM_ATTRIBUTES_FIELD_SELECTION}
    billingPolicy {
      ${BILLING_POLICY_FIELD_SELECTION}
    }
    deliveryPolicy {
      ${DELIVERY_POLICY_FIELD_SELECTION}
    }
    deliveryPrice {
      ${PRICE_FIELD_SELECTION}
    }
    billingCycle {
      billingAttemptExpectedDate
      cycleEndAt
      cycleIndex
      cycleStartAt
      status
    }
  }
  ${USER_ERROR_SELECTION}`
