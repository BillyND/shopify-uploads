export const SUBSCRIPTION_BILLING_ATTEMPT_FIELD_SELECTION = `
  nodes {
    id
    ready
    createdAt
    errorCode
    originTime
    completedAt
    errorMessage
    nextActionUrl
    idempotencyKey
    order {
      id
    }
    subscriptionContract {
      id
    }
  }`
