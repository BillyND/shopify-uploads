import { ORDER_FIELD_SELECTION } from './constants.server'

export function queryForOrderById(orderId: string) {
  return `
    query {
      node(id: "${orderId}") {
        id
        ... on Order {
          ${ORDER_FIELD_SELECTION}
        }
      }
    }`
}
