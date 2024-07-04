import { ITEM_LIST_LIMITATION } from '~/constants'
import {
  ANCHORS_FIELD_SELECTION,
  BILLING_POLICY_FIELD_SELECTION,
  DELIVERY_POLICY_FIELD_SELECTION,
  PRICE_FIELD_SELECTION,
  USER_ERROR_SELECTION,
} from '~/shopify/graphql/constants.server'

export const SELLING_PLAN_GROUP_FIELD_SELECTION = `
  sellingPlanGroup {
    id
    name
    appId
    options
    summary
    position
    description
    merchantCode
    productsCount {
      count
      precision
    }
    sellingPlans(first: ${ITEM_LIST_LIMITATION}) {
      edges {
        node {
          id
          name
          options
          category
          position
          createdAt
          description
          billingPolicy {
            __typename
            ... on SellingPlanFixedBillingPolicy {
              checkoutCharge {
                type
                value {
                  ... on MoneyV2 {
                    ${PRICE_FIELD_SELECTION}
                  }
                  ... on SellingPlanCheckoutChargePercentageValue {
                    percentage
                  }
                }
              }
              remainingBalanceChargeExactTime
              remainingBalanceChargeTimeAfterCheckout
              remainingBalanceChargeTrigger
            }
            ... on SellingPlanRecurringBillingPolicy {
              ${BILLING_POLICY_FIELD_SELECTION}
            }
          }
          deliveryPolicy {
            __typename
            ... on SellingPlanFixedDeliveryPolicy {
              ${ANCHORS_FIELD_SELECTION}
              cutoff
              fulfillmentExactTime
              fulfillmentTrigger
              intent
              preAnchorBehavior
            }
            ... on SellingPlanRecurringDeliveryPolicy {
              ${DELIVERY_POLICY_FIELD_SELECTION}
              createdAt
              cutoff
              intent
              preAnchorBehavior
            }
          }
          inventoryPolicy {
            reserve
          }
          pricingPolicies {
            __typename
            ... on SellingPlanFixedPricingPolicy {
              adjustmentType
              adjustmentValue {
                ... on MoneyV2 {
                  ${PRICE_FIELD_SELECTION}
                }
                ... on SellingPlanPricingPolicyPercentageValue {
                  percentage
                }
              }
              createdAt
            }
            ... on SellingPlanRecurringPricingPolicy {
              adjustmentType
              adjustmentValue {
                ... on MoneyV2 {
                  ${PRICE_FIELD_SELECTION}
                }
                ... on SellingPlanPricingPolicyPercentageValue {
                  percentage
                }
              }
              afterCycle
              createdAt
            }
          }
        }
      }
    }
  }
  ${USER_ERROR_SELECTION}`
