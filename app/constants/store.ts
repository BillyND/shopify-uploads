import { createStore } from '~/libs/external-store'
import type { IGlobalConfig } from '~/types/global-config'

export const initGlobalConfig: IGlobalConfig = {
  shopDomain: '',
  fetchingConfig: false,
  createdAt: undefined,
  appConfig: {
    enableAppBlockLink: '',
    isThemeAppExtEnabled: false,

    notificationSetting: {
      customer: {
        startedSubscription: false,
      },
      merchant: {
        startedSubscription: false,
      },
    },

    emailSetting: {
      sendFrom: 'DEFAULT_APP_EMAIL',
    },
  },
  shopConfig: {},
}

export const globalConfigStore = createStore<IGlobalConfig>(initGlobalConfig)
