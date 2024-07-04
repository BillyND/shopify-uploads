import { SUBSCRIPTION_CONTRACT_FIELD_SELECTION } from './constants.server'

export const queryForSubscriptionContractById = `
  query findContract($subscriptionContractId: ID!) {
    subscriptionContract(id: $subscriptionContractId) {
      ${SUBSCRIPTION_CONTRACT_FIELD_SELECTION}
    }
  }`
