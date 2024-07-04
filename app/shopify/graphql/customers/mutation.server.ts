import { USER_ERROR_SELECTION } from '../constants.server'

export const mutationSendCustomerPaymentUpdateEmail = `
  mutation sendCustomerPaymentUpdateEmail($customerPaymentMethodId: ID!) {
    customerPaymentMethodSendUpdateEmail(customerPaymentMethodId: $customerPaymentMethodId) {
      customer {
        id
      }
      ${USER_ERROR_SELECTION}
    }
  }`

export const mutationCustomerPaymentMethodGetUpdateUrl = `
  mutation customerPaymentMethodGetUpdateUrl($customerPaymentMethodId: ID!) {
    customerPaymentMethodGetUpdateUrl(customerPaymentMethodId: $customerPaymentMethodId) {
      updatePaymentMethodUrl
      ${USER_ERROR_SELECTION}
    }
  }`
