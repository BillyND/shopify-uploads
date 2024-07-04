export type TypeNotification = 'merchant' | 'customer'
export type TypeSendEmail = 'DEFAULT_APP_EMAIL' | 'CUSTOM_USERNAME' | 'CUSTOM_EMAIL'
export type KeyNotification = 'startedSubscription'

export interface IGlobalConfig {
  shopDomain: string
  fetchingConfig: boolean
  createdAt: Date | undefined
  appConfig: {
    enableAppBlockLink: string
    isThemeAppExtEnabled: boolean
    notificationSetting: {
      customer: {
        startedSubscription: boolean
      }
      merchant: {
        startedSubscription: boolean
      }
    }
    emailSetting: {
      sendFrom: TypeSendEmail
    }
  }
  shopConfig: any
}
