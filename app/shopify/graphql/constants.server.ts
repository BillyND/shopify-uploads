export const PAGE_INFO_SELECTION = `
  pageInfo {
    endCursor
    startCursor
    hasNextPage
    hasPreviousPage
  }`

export const USER_ERROR_SELECTION = `
  userErrors {
    field
    message
  }`

export const IMAGE_FIELD_SELECTION = `
  id
  url
  width
  height
  altText`

export const COUNT_FIELD_SELECTION = `
  count
  precision`

export const PRICE_FIELD_SELECTION = `
  amount
  currencyCode`

export const PRICE_SET_FIELD_SELECTION = `
  presentmentMoney {
    ${PRICE_FIELD_SELECTION}
  }
  shopMoney {
    ${PRICE_FIELD_SELECTION}
  }`

export const CREDIT_CARD_BILLING_ADDRESS_FIELD_SELECTION = `
  zip
  city
  country
  address1
  lastName
  province
  firstName
  countryCode
  provinceCode`

export const PAYMENT_INSTRUMENT_BILLING_ADDRESS_FIELD_SELECTION = `
  zip
  city
  name
  country
  address1
  province
  countryCode
  provinceCode`

export const MAILING_ADDRESS_FIELD_SELECTION = `
  zip
  city
  name
  phone
  company
  country
  address1
  address2
  lastName
  latitude
  province
  timeZone
  firstName
  formatted
  longitude
  provinceCode
  countryCodeV2
  formattedArea
  coordinatesValidated`

export const ANCHORS_FIELD_SELECTION = `
  anchors {
    cutoffDay
    day
    month
    type
  }`

export const BILLING_POLICY_FIELD_SELECTION = `
  ${ANCHORS_FIELD_SELECTION}
  interval
  intervalCount
  maxCycles
  minCycles`

export const DELIVERY_POLICY_FIELD_SELECTION = `
  ${ANCHORS_FIELD_SELECTION}
  interval
  intervalCount`

export const CUSTOM_ATTRIBUTES_FIELD_SELECTION = `
  customAttributes {
    key
    value
  }`

export const CUSTOMER_PAYMENT_METHOD_FIELD_SELECTION = `
  id
  customer {
    id
  }
  instrument {
    ... on CustomerCreditCard {
      name
      brand
      source
      expiryYear
      lastDigits
      expiresSoon
      expiryMonth
      firstDigits
      isRevocable
      maskedNumber
      virtualLastDigits
      billingAddress {
        ${CREDIT_CARD_BILLING_ADDRESS_FIELD_SELECTION}
      }
    }
    ... on CustomerPaypalBillingAgreement {
      inactive
      isRevocable
      paypalAccountEmail
      billingAddress {
        ${PAYMENT_INSTRUMENT_BILLING_ADDRESS_FIELD_SELECTION}
      }
    }
    ... on CustomerShopPayAgreement {
      name
      inactive
      expiryYear
      lastDigits
      expiresSoon
      expiryMonth
      isRevocable
      maskedNumber
      billingAddress {
        ${CREDIT_CARD_BILLING_ADDRESS_FIELD_SELECTION}
      }
    }
  }`
