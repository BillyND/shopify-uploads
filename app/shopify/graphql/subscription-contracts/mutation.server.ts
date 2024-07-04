import {
  SUBSCRIPTION_CONTRACT_DRAFT_FIELD_SELECTION,
  SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION,
} from './constants.server'

/**
 * GraphQL mutation to update a subscription contract.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptioncontractupdate
 *
 * @returns {string}
 */
export const mutationSubscriptionContractUpdate = `
  mutation subscriptionContractUpdate($contractId: ID!) {
    subscriptionContractUpdate(contractId: $contractId) {
      ${SUBSCRIPTION_CONTRACT_DRAFT_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to update a subscription contract draft.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionDraftUpdate
 *
 * @returns {string}
 */
export const mutationSubscriptionDraftUpdate = `
  mutation subscriptionDraftUpdate($draftId: ID!, $input: SubscriptionDraftInput!) {
    subscriptionDraftUpdate(draftId: $draftId, input: $input) {
      ${SUBSCRIPTION_CONTRACT_DRAFT_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to commit a subscription contract draft.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionDraftCommit
 *
 * @returns {string}
 */
export const mutationSubscriptionDraftCommit = `
  mutation subscriptionDraftCommit($draftId: ID!) {
    subscriptionDraftCommit(draftId: $draftId) {
      ${SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to activate a subscription contract.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionContractActivate
 *
 * @returns {string}
 */
export const mutationSubscriptionContractActivate = `
  mutation subscriptionContractActivate($subscriptionContractId: ID!) {
    subscriptionContractActivate(subscriptionContractId: $subscriptionContractId) {
      ${SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to cancel a subscription contract.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionContractCancel
 *
 * @returns {string}
 */
export const mutationSubscriptionContractCancel = `
  mutation subscriptionContractCancel($subscriptionContractId: ID!) {
    subscriptionContractCancel(subscriptionContractId: $subscriptionContractId) {
      ${SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to expire a subscription contract.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionContractExpire
 *
 * @returns {string}
 */
export const mutationSubscriptionContractExpire = `
  mutation subscriptionContractExpire($subscriptionContractId: ID!) {
    subscriptionContractExpire(subscriptionContractId: $subscriptionContractId) {
      ${SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to fail a subscription contract.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionContractFail
 *
 * @returns {string}
 */
export const mutationSubscriptionContractFail = `
  mutation subscriptionContractFail($subscriptionContractId: ID!) {
    subscriptionContractFail(subscriptionContractId: $subscriptionContractId) {
      ${SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION}
    }
  }`

/**
 * GraphQL mutation to pause a subscription contract.
 *
 * @see https://shopify.dev/docs/api/admin-graphql/2024-04/mutations/subscriptionContractPause
 *
 * @returns {string}
 */
export const mutationSubscriptionContractPause = `
  mutation subscriptionContractPause($subscriptionContractId: ID!) {
    subscriptionContractPause(subscriptionContractId: $subscriptionContractId) {
      ${SUBSCRIPTION_CONTRACT_MUTATION_FIELD_SELECTION}
    }
  }`
