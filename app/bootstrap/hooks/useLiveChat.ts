import { ChatboxPosition, Crisp } from 'crisp-sdk-web'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { globalConfigStore } from '~/constants/store'
import { useStore } from '~/libs/external-store'
import { useRootLoaderData } from '~/root'

const formatTime = (time: string) => format(time, 'yyyy-MM-dd')
let initialized = false
const CRISP_ZINDEX = 512

const acceptCrisp = true

export const useLiveChat = () => {
  const { shopConfig, createdAt: installed_at } = useStore(globalConfigStore, ({ shopConfig, createdAt }) => ({
    shopConfig,
    createdAt,
  }))
  const { shopifyPartnerId, crispWebsiteId } = useRootLoaderData()!

  const [isNewConversation, setIsNewConversation] = useState(null)

  const {
    id: shopId,
    email,
    shop_owner,
    phone,
    created_at,
    plan_display_name,
    myshopify_domain: shopDomain,
  } = shopConfig

  const initCrisp = () => {
    if (!initialized && crispWebsiteId && shopId) {
      console.log('Everflow: init Crisp package')

      const storeAccess = `https://partners.shopify.com/${shopifyPartnerId}/stores/${shopId}`
      Crisp.configure(crispWebsiteId)
      Crisp.setTokenId(shopDomain)
      Crisp.setZIndex(CRISP_ZINDEX)
      Crisp.setPosition(ChatboxPosition.Right)
      email && Crisp.user.setEmail(email)
      shop_owner && Crisp.user.setNickname(shop_owner)
      phone && Crisp.user.setPhone(phone)

      Crisp.session.setData({
        installed_at: formatTime((installed_at ?? new Date()).toString()),
        created_at: formatTime((created_at ?? new Date()).toString()),
        store_access: storeAccess || '',
        everflow_plan: 'Free',
        price: 0,
        shopify_plan: plan_display_name || '',
        store_url: shopDomain || '',
      })

      Crisp.chat.onChatInitiated(() => {
        console.log('Everflow: on chat initiated')
        Crisp.session.setSegments(['everflow'], true)
      })
      Crisp.chat.onChatOpened(() => {
        Crisp.session.setSegments(['everflow'], true)
      })
      Crisp.session.onLoaded(() => {
        setTimeout(() => {
          setIsNewConversation(window.$crisp?.is && !window.$crisp.is('session:ongoing'))
        }, 1500)
      })
      Crisp.setAvailabilityTooltip(false)
      initialized = true
    }

    if (!acceptCrisp && crispWebsiteId && shopId) {
      Crisp.chat.hide()
    }

    if (acceptCrisp && crispWebsiteId && shopId) {
      Crisp.chat.show()
    }
  }

  const openChatBox = () => {
    if (acceptCrisp) {
      Crisp.chat.show()
      Crisp.chat.open()
    }
  }

  useEffect(() => {
    if (isNewConversation && acceptCrisp) {
      Crisp.chat.show()
      Crisp.setAvailabilityTooltip(true)
    }
  }, [isNewConversation, acceptCrisp])

  return {
    initCrisp,
    openChatBox,
  }
}
