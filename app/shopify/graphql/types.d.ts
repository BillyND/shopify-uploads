export type ConnectionArguments = {
  after?: string
  before?: string
  first?: number
  last?: number
  query?: string
  reverse?: boolean
  sortKey?: string
}

export type AttributeInput = {
  key: string
  value: string
}

export type MailingAddressInput = {
  address1: string
  address2: string
  city: string
  company: string
  countryCode: string
  firstName: string
  lastName: string
  phone: string
  provinceCode: string
  zip: string
}
