// The fixed selling plan billing policy defines how much of the price of the product
// will be billed to customer at checkout. If there is an outstanding balance, it
// determines when it will be paid.
export type BillingPolicyFixed = Partial<{
  // The checkout charge when the full amount isn't charged at checkout
  checkoutCharge: Partial<{
    // The charge type for the checkout charge
    type: 'PERCENTAGE' | 'PRICE'
    // The charge value for the checkout charge
    value: Partial<{
      fixedValue: number
      percentage: number
    }>
  }>
  // The exact time when to capture the full payment
  remainingBalanceChargeExactTime: Date
  // The period after `remaining_balance_charge_trigger`, before capturing the full
  // payment. Expressed as an ISO8601 duration.
  remainingBalanceChargeTimeAfterCheckout: string
  // When to capture payment for amount due
  remainingBalanceChargeTrigger: 'EXACT_TIME' | 'NO_REMAINING_BALANCE' | 'TIME_AFTER_CHECKOUT'
}>

// Represents a recurring selling plan billing policy
export type BillingPolicyRecurring = Partial<{
  // Specific anchor dates upon which the billing interval calculations should be made
  anchors: null | Partial<{
    // Represents the anchor type, it can be one one of WEEKDAY, MONTHDAY, YEARDAY
    type: 'MONTHDAY' | 'WEEKDAY' | 'YEARDAY'
    // The cutoff day of the anchor.
    //
    // If type is WEEKDAY, then the value must be between 1-7. Shopify interprets the
    // days of the week according to ISO 8601, where 1 is Monday.
    //
    // If type is MONTHDAY, then the value must be between 1-31.
    //
    // If type is YEARDAY, then the value must be null.
    //
    // This field should only be set if the `cutoff` field for the delivery policy is null.
    cutoffDay: number
    // The day of the anchor.
    //
    // If type is WEEKDAY, then the value must be between 1-7. Shopify interprets the
    // days of the week according to ISO 8601, where 1 is Monday.
    //
    // If type isn't WEEKDAY, then the value must be between 1-31.
    day: number
    // The month of the anchor. If type is different than YEARDAY, then the value must
    // be null or between 1-12.
    month: number
  }>
  // The billing frequency, it can be either: day, week, month or year
  interval: 'DAY' | 'MONTH' | 'WEEK' | 'YEAR'
  // The number of intervals between billings
  intervalCount: number
  // Maximum number of billing iterations
  maxCycles: number
  // Minimum number of billing iterations
  minCycles: number
}>

export type BillingPolicy = Partial<{
  fixed: BillingPolicyFixed
  recurring: BillingPolicyRecurring
}>

// Represents a fixed selling plan delivery policy
export type DeliveryPolicyFixed = Partial<{
  // The specific anchor dates upon which the delivery interval calculations should be made
  anchors: Partial<{
    // Represents the anchor type, it can be one one of WEEKDAY, MONTHDAY, YEARDAY
    type: 'MONTHDAY' | 'WEEKDAY' | 'YEARDAY'
    // The cutoff day for the anchor.
    //
    // If `type` is WEEKDAY, then the value must be between 1-7. Shopify interprets the days
    // of the week according to ISO 8601, where 1 is Monday.
    //
    // If `type` is MONTHDAY, then the value must be between 1-31.
    //
    // If `type` is YEARDAY, then the value must be null.
    cutoffDay: number
    // The day of the anchor.
    //
    // If `type` is WEEKDAY, then the value must be between 1-7. Shopify interprets the days
    // of the week according to ISO 8601, where 1 is Monday.
    //
    // If `type` isn't WEEKDAY, then the value must be between 1-31.
    day: number
    // The month of the anchor.
    //
    // If type is different than YEARDAY, then the value must be `null` or between 1-12.
    month: number
  }>
  // A buffer period for orders to be included in next fulfillment anchor
  cutoff: number
  // The date and time when the fulfillment should trigger
  fulfillmentExactTime: Date
  // What triggers the fulfillment. The value must be one of ANCHOR, ASAP, EXACT_TIME, or UNKNOWN.
  fulfillmentTrigger: 'ANCHOR' | 'ASAP' | 'EXACT_TIME' | 'UNKNOWN'
  // Whether the delivery policy is merchant or buyer-centric.
  //
  // Buyer-centric delivery policies state the time when the buyer will receive the goods.
  //
  // Merchant-centric delivery policies state the time when the fulfillment should be started.
  //
  // Currently, only merchant-centric delivery policies are supported.
  intent: 'FULFILLMENT_BEGIN'
  // The fulfillment or delivery behavior of the first fulfillment when
  // the order is placed before the anchor. The default value for this
  // field is ASAP.
  preAnchorBehavior: 'ASAP' | 'NEXT'
}>

// Represents a recurring selling plan delivery policy
export type DeliveryPolicyRecurring = Partial<{
  // The specific anchor dates upon which the delivery interval calculations should be made
  anchors: null | Partial<{
    // Represents the anchor type, it can be one one of WEEKDAY, MONTHDAY, YEARDAY
    type: 'MONTHDAY' | 'WEEKDAY' | 'YEARDAY'
    // The cutoff day for the anchor.
    //
    // If `type` is WEEKDAY, then the value must be between 1-7. Shopify interprets the days
    // of the week according to ISO 8601, where 1 is Monday.
    //
    // If `type` is MONTHDAY, then the value must be between 1-31.
    //
    // If `type` is YEARDAY, then the value must be null.
    cutoffDay: number
    // The day of the anchor.
    //
    // If `type` is WEEKDAY, then the value must be between 1-7. Shopify interprets the days
    // of the week according to ISO 8601, where 1 is Monday.
    //
    // If `type` isn't WEEKDAY, then the value must be between 1-31.
    day: number
    // The month of the anchor.
    //
    // If type is different than YEARDAY, then the value must be `null` or between 1-12.
    month: number
  }>
  // Number of days which represent a buffer period for orders to be included in a cycle
  cutoff: null | Number
  // Whether the delivery policy is merchant or buyer-centric.
  //
  // Buyer-centric delivery policies state the time when the buyer will receive the goods.
  //
  // Merchant-centric delivery policies state the time when the fulfillment should be started.
  //
  // Currently, only merchant-centric delivery policies are supported.
  intent: 'FULFILLMENT_BEGIN'
  // The delivery frequency, it can be either: day, week, month or year
  interval: 'DAY' | 'MONTH' | 'WEEK' | 'YEAR'
  // The number of intervals between deliveries
  intervalCount: number
  // The fulfillment or delivery behavior of the first fulfillment when
  // the order is placed before the anchor. The default value for this
  // field is ASAP.
  preAnchorBehavior: 'ASAP' | 'NEXT'
}>

export type DeliveryPolicy = Partial<{
  fixed: DeliveryPolicyFixed
  recurring: DeliveryPolicyRecurring
}>

// Represents the pricing policy of a subscription or deferred purchase option selling
// plan. The selling plan fixed pricing policy works with the billing and delivery
// policy to determine the final price. Discounts are divided among fulfillments.
//
// For example, a subscription with a $10 discount and two deliveries will have a $5
// discount applied to each delivery.
export type PricingPolicyFixed = Partial<{
  // The price adjustment type
  adjustmentType: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'PRICE'
  // The price adjustment value
  adjustmentValue: Partial<{
    fixedValue: number
    amount: number
    percentage: Number
  }>
}>

export type PricingPolicyRecurring = Partial<{
  // The price adjustment type
  adjustmentType: 'FIXED_AMOUNT' | 'PERCENTAGE' | 'PRICE'
  // The price adjustment value
  adjustmentValue: Partial<{
    fixedValue: number
    amount: number
    percentage: number
  }>
  // Cycle after which this pricing policy applies
  afterCycle: number
}>

export type PricingPolicy = Partial<{
  fixed: PricingPolicyFixed
  recurring: PricingPolicyRecurring
}>

// Define input object for creating/updating a selling plan
export type SellingPlanInput = Partial<{
  appId: string | number
  id: string
  name: string
  // The values of all options available on the selling plan. Selling plans are
  // grouped together in Liquid when they're created by the same app, and have the
  // same `selling_plan_group.name` and `selling_plan_group.options` values.
  options: string
  position: number
  description: string
  billingPolicy: BillingPolicy
  deliveryPolicy: DeliveryPolicy
  pricingPolicies: PricingPolicy[]
  category: 'OTHER' | 'PRE_ORDER' | 'SUBSCRIPTION' | 'TRY_BEFORE_YOU_BUY'
  inventoryPolicy: {
    reserve: 'ON_FULFILLMENT' | 'ON_SALE'
  }
}>

// Define input object for creating/updating a selling plan group
export type SellingPlanGroupInput = Partial<{
  id: string
  name: string
  appId: string
  position: number
  options: string[]
  description: string
  merchantCode: string
  sellingPlansToDelete: string[]
  sellingPlansToCreate: SellingPlanInput[]
  sellingPlansToUpdate: SellingPlanInput[]
}>

// Define resource objects that can associate with a selling plan group
export type SellingPlanGroupResources = Partial<{
  productIds: string[]
  productVariantIds: string[]
}>
