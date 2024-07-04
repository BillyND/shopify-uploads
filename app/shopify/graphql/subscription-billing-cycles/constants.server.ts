import { COUNT_FIELD_SELECTION, CUSTOM_ATTRIBUTES_FIELD_SELECTION, PRICE_FIELD_SELECTION } from '../constants.server'

export const SUBSCRIPTION_MAILING_ADDRESS_FIELD_SELECTION = `
  zip
  city
  name
  phone
  company
  country
  address1
  address2
  lastName
  province
  firstName
  countryCode
  provinceCode`

export const SUBSCRIPTION_BILLING_CYCLE_FIELD_SELECTION = `
  nodes {
    edited
    status
    skipped
    cycleEndAt
    cycleIndex
    cycleStartAt
    billingAttemptExpectedDate
    sourceContract {
      id
    }
    editedContract {
      createdAt
      currencyCode
      ${CUSTOM_ATTRIBUTES_FIELD_SELECTION}
      customer {
        id
      }
      deliveryPrice {
        ${PRICE_FIELD_SELECTION}
      }
      linesCount {
        ${COUNT_FIELD_SELECTION}
      }
      deliveryMethod {
        ... on SubscriptionDeliveryMethodLocalDelivery {
          address {
            ${SUBSCRIPTION_MAILING_ADDRESS_FIELD_SELECTION}
          }
          localDeliveryOption {
            code
            description
            instructions
            phone
            presentmentTitle
            title
          }
        }
        ... on SubscriptionDeliveryMethodPickup {
          pickupOption {
            code
            description
            presentmentTitle
            title
          }
        }
        ... on SubscriptionDeliveryMethodShipping {
          address {
            ${SUBSCRIPTION_MAILING_ADDRESS_FIELD_SELECTION}
          }
          shippingOption {
            code
            description
            presentmentTitle
            title
          }
        }
      }
    }
  }`
