import { useEffect, type ComponentClass, type FunctionComponent } from 'react'
import { useLiveChat } from '../hooks/useLiveChat'
import { useStore } from '~/libs/external-store'
import { globalConfigStore } from '~/constants/store'

export default function withCrispChat(Component: FunctionComponent | ComponentClass) {
  return function WithCrispChat(props: any) {
    const { createdAt } = useStore(globalConfigStore, ({ createdAt }) => ({ createdAt }))
    const { initCrisp } = useLiveChat()

    useEffect(() => {
      createdAt && initCrisp()
    }, [createdAt])

    return <Component {...props} />
  }
}
