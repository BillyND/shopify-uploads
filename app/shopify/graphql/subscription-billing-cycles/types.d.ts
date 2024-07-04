export type SubscriptionBillingCycleConnectionArguments = ConnectionArguments & {
  contractId?: string
  billingCyclesDateRangeSelector?: {
    endDate: string
    startDate: string
  }
  billingCyclesIndexRangeSelector?: {
    endIndex: number
    startIndex: number
  }
}
