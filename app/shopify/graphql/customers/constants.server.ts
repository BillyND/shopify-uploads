import { ITEM_LIST_LIMITATION } from '~/constants'
import { CUSTOMER_PAYMENT_METHOD_FIELD_SELECTION, MAILING_ADDRESS_FIELD_SELECTION } from '../constants.server'

export const CUSTOMER_FIELD_SELECTION = `
  id
  note
  tags
  email
  phone
  state
  lastName
  firstName
  createdAt
  updatedAt
  verifiedEmail
  legacyResourceId
  defaultAddress {
    id
    ${MAILING_ADDRESS_FIELD_SELECTION}
  }
  addresses(first: ${ITEM_LIST_LIMITATION}) {
    id
    ${MAILING_ADDRESS_FIELD_SELECTION}
  }
  paymentMethods(first: ${ITEM_LIST_LIMITATION}) {
    nodes {
      ${CUSTOMER_PAYMENT_METHOD_FIELD_SELECTION}
    }
  }`
