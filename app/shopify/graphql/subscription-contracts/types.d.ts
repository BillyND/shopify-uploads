import type { AttributeInput, MailingAddressInput } from '../types'
import type { BillingPolicyRecurring } from '../selling-plan-groups/types'

// Define input object for updating a subscription contract draft
export type SubscriptionDraftInput = Partial<{
  billingPolicy: BillingPolicyRecurring
  customAttributes: AttributeInput[]
  deliveryMethod: Partial<{
    localDelivery: {
      address: MailingAddressInput
      localDeliveryOption: {
        code: string
        description: string
        instructions: string
        phone: string
        presentmentTitle: string
        title: string
      }
    }
    pickup: {
      pickupOption: {
        code: string
        description: string
        locationId: string
        presentmentTitle: string
        title: string
      }
    }
    shipping: {
      address: MailingAddressInput
      shippingOption: {
        carrierServiceId: string
        code: string
        description: string
        presentmentTitle: string
        title: string
      }
    }
  }>
  deliveryPolicy: {
    anchors: {
      cutoffDay: number
      day: number
      month: number
      type: 'MONTHDAY' | 'WEEKDAY' | 'YEARDAY'
    }[]
    interval: 'DAY' | 'MONTH' | 'WEEK' | 'YEAR'
    intervalCount: number
  }
  deliveryPrice: number
  nextBillingDate: string
  note: string
  paymentMethodId: string
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'FAILED' | 'PAUSED'
}>
