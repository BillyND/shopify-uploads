import type { SubscriptionBillingCycleConnectionArguments } from './types'
import { getConnectionArguments } from '~/shopify/graphql/fns.server'
import { PAGE_INFO_SELECTION } from '~/shopify/graphql/constants.server'
import { SUBSCRIPTION_BILLING_CYCLE_FIELD_SELECTION } from './constants.server'

/**
 * Generate a GraphQL query for retrieving a list of subscription billing cycles.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/queries/subscriptionBillingCycles
 *
 * @param {object} params An object that specifies SubscriptionBillingAttemptConnection arguments
 *
 * @returns {string}
 */
export function queryForSubscriptionBillingCycles(params: SubscriptionBillingCycleConnectionArguments = {}): string {
  // Prepare connection arguments
  const connectionArguments = getConnectionArguments(params)
  const { contractId, billingCyclesDateRangeSelector, billingCyclesIndexRangeSelector } = params

  if (contractId) {
    connectionArguments.push(`contractId: "${contractId}"`)
  }

  if (billingCyclesDateRangeSelector) {
    const { endDate, startDate } = billingCyclesDateRangeSelector

    connectionArguments.push(`billingCyclesDateRangeSelector: {endDate: "${endDate}", startDate: "${startDate}"}`)
  }

  if (billingCyclesIndexRangeSelector) {
    const { endIndex, startIndex } = billingCyclesIndexRangeSelector

    connectionArguments.push(`billingCyclesIndexRangeSelector: {endIndex: ${endIndex}, startIndex: ${startIndex}}`)
  }

  return `
    query subscriptionBillingCycles {
      subscriptionBillingCycles(${connectionArguments.join(', ')}) {
        ${SUBSCRIPTION_BILLING_CYCLE_FIELD_SELECTION}
        ${PAGE_INFO_SELECTION}
      }
    }`
}
