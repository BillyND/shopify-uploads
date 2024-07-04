import type { ConnectionArguments } from '~/shopify/graphql/types'
import { getConnectionArguments } from '~/shopify/graphql/fns.server'
import { PAGE_INFO_SELECTION } from '~/shopify/graphql/constants.server'
import { SUBSCRIPTION_BILLING_ATTEMPT_FIELD_SELECTION } from './constants.server'

export const queryForSubscriptionBillingAttemptById = `
  query findBillingAttempt($subscriptionBillingAttempt: ID!) {
    subscriptionBillingAttempt(id: $subscriptionBillingAttempt) {
      ${SUBSCRIPTION_BILLING_ATTEMPT_FIELD_SELECTION}
    }
  }`

/**
 * Generate a GraphQL query for retrieving a list of subscription billing attempts.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/queries/subscriptionBillingAttempts
 *
 * @param {object} params An object that specifies SubscriptionBillingAttemptConnection arguments
 *
 * @returns {string}
 */
export function queryForSubscriptionBillingAttempts(params: ConnectionArguments = {}): string {
  return `
    query subscriptionBillingAttempts {
      subscriptionBillingAttempts(${getConnectionArguments(params).join(', ')}) {
        ${SUBSCRIPTION_BILLING_ATTEMPT_FIELD_SELECTION}
        ${PAGE_INFO_SELECTION}
      }
    }`
}
