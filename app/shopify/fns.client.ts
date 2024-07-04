import { sleep } from '~/bootstrap/fns/time'

// Define variable to hold URLs that are requesting
const requesting: { [key: string]: boolean } = {}

export async function authenticatedFetch(url: string, opts?: any) {
  try {
    // Do not request the same URL with the same method and the same payload more than one time
    const key = ['GET', undefined].includes(opts?.method) && url

    if (key) {
      if (requesting[key]) {
        await sleep(100)
        return authenticatedFetch(url, opts)
      }

      requesting[key] = true
    }

    const shopify = window.opener?.shopify ?? window.shopify
    const idToken = await shopify?.idToken()

    const headers = {
      ...opts?.headers,
      Authorization: `Bearer ${idToken}`,
    }

    const result = await fetch(url, { ...opts, headers }).then(res => res.json())

    // Clear requesting state
    if (key) {
      delete requesting[key]
    }

    return result
  } catch (e) {
    console.error(e)
  }
}
