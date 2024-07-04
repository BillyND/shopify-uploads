import { CUSTOMER_FIELD_SELECTION } from './constants.server'

export function queryForCustomer(customerId: string) {
  return `
    query {
      node(id: "${customerId}") {
        id
        ... on Customer {
          ${CUSTOMER_FIELD_SELECTION}
        }
      }
    }`
}
