import { useFetcher } from '@remix-run/react'
import { useCallback, useEffect, useState } from 'react'
import type { EFetcherKeys } from '~/shopify/login/constants'

/**
 * @author David Nguyen
 * Using this hook to inherit the properties of useFetcher() provided by Remix
 * Use it to handle Promise data returned similar to fetch: .then().catch()
 * @returns Promise<any> => _submit(data, options)
 * @param data Object contain { type, data }
 * @param options Options for the submission { method, action }
 * See detail document: https://remix.run/docs/en/main/hooks/use-fetcher
 */

type TUseHTTP = {
  key: EFetcherKeys
}

export function useHTTP<T extends Record<string, any>>(
  opts?: TUseHTTP
): (data: any, options: any) => Promise<{ success: boolean } & T> {
  const fetcher = useFetcher(opts?.key ? { key: opts.key } : undefined)
  const [promise, setDeferred] = useState(customPromise())
  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data) {
      //@ts-ignore
      promise.resolve(fetcher.data)
      setDeferred(customPromise())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data])

  const _submit = useCallback(
    (data: any, options: any): Promise<{ success: boolean } & T> => {
      fetcher.submit(data, options)
      //@ts-ignore
      return promise.promise
    },
    [promise.promise, fetcher]
  )

  return _submit
}

export function customPromise() {
  let resolve
  let reject

  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return { resolve, reject, promise }
}
