/**
 * Options for setting a cookie.
 */
interface CookieOptions {
  expires?: Date
  path?: string
  domain?: string
  secure?: boolean
  samesite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Retrieves the value of a cookie by its name.
 * @param name - The name of the cookie to retrieve.
 * @returns The value of the cookie, or null if the cookie is not found.
 */
export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')

  for (let cookie of cookies) {
    cookie = cookie.trim()

    if (cookie.startsWith(nameEQ)) {
      try {
        return JSON.parse(cookie.substring(nameEQ.length))
      } catch (error) {
        console.error('Parse cookie failed')
        return cookie.substring(nameEQ.length)
      }
    }
  }

  return null
}

/**
 * Sets a cookie with the given name, value, and optional configuration options.
 * @param name - The name of the cookie to set.
 * @param value - The value to assign to the cookie.
 * @param options - Additional configuration options for the cookie (optional).
 */
export function setCookie(name: string, value: any, options: CookieOptions = {}): void {
  const {
    expires = new Date(Date.now() + 86400000), // Default expiration is 1 day
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    samesite = 'None',
  } = options

  let cookieString = `${name}=${JSON.stringify(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (path) {
    cookieString += `; path=${path}`
  }

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += `; secure`
  }

  if (samesite) {
    cookieString += `; samesite=${samesite}`
  }

  document.cookie = cookieString
}
