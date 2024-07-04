import crypto from 'crypto'

const customerioSiteId = process.env.CUSTOMERIO_SITE_ID
const customerioApiKey = process.env.CUSTOMERIO_API_KEY
const customerioBetaApiKey = process.env.CUSTOMERIO_APP_API_KEY
const customerioUrl = 'https://track.customer.io/api/v1'
const customerioBetaApiUrl = 'https://beta-api.customer.io/v1/api'
const headers = {
  'Content-Type': 'application/json',
}

/**
 * Method that sends a request to customer.io API.
 *
 * @param   string  endPoint     The API end point to send request to. E.g. customer
 * @param   string  method       The method to send request. E.g. get, put, etc.
 * @param   object  postData     The data to send in request body.
 *
 * @return  Promise
 */
export function requestCustomerIoApi(endPoint: string, method = 'get', postData: any = undefined) {
  return new Promise(async (resolve, reject) => {
    if (method !== 'get' && method !== 'post' && method !== 'put' && method !== 'delete') {
      return reject(`The provided method ${method} is invalid.`)
    }
    try {
      const res = await fetch(`${customerioUrl}/${endPoint}`, {
        method,
        headers: {
          Authorization: `Basic ${Buffer.from(`${customerioSiteId}:${customerioApiKey}`).toString('base64')}`,
          ...headers,
        },
        body: JSON.stringify(postData),
      })

      const data = await res.json()

      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Method that posts an event to customer.io
 *
 * @param   string  eventName  Name of event to post.
 * @param   object  eventData   Data to post along with event.
 * @param   object  toEmail  Customer's email
 *
 * @return  Promise
 */
export const postEventToCustomerIo = (eventName: string, eventData = {}, toEmail: string) => {
  return new Promise((resolve, reject) => {
    // Sync user data to email profile at customer.io first.
    syncUserDataToCustomerIo(toEmail).then(async (id: unknown) => {
      // Prepare post data.
      const data = {
        data: {
          ...eventData,
        },
        name: eventName,
      }

      // Post event to customer.io
      requestCustomerIoApi(`customers/${id}/events`, 'post', data).then(resolve).catch(reject)
    })
  })
}

export const deleteUserFromCustomerIo = (email: string) => {
  return new Promise((resolve, reject) => {
    // Sync user data to email profile at customer.io first.
    syncUserDataToCustomerIo(email).then(async (id: unknown) => {
      // Post event to customer.io
      requestCustomerIoApi(`customers/${id}`, 'delete').then(resolve).catch(reject)
    })
  })
}

/**
 * Posts an anonymous event to Customer.io with the given event name and data.
 *
 * @param eventName - The name of the event to be posted.
 * @param recipientData - The recipient's data, including email and name.
 * @param eventData - Additional event data (default is an empty object).
 * @returns A Promise that resolves when the event is successfully posted, or rejects if there is an error.
 */
export const postAnonymousEventCustomerIo = (eventName: string, eventData = {}, toEmail: string) => {
  return new Promise((resolve, reject) => {
    const data = {
      data: {
        toEmail,
        ...eventData,
      },
      name: eventName,
    }

    // Post event to Customer.io
    requestCustomerIoApi(`events`, 'post', data).then(resolve).catch(reject)
  })
}

function hashEmail(email: string) {
  const hash = crypto.createHash('md5')
  hash.update(email)
  return hash.digest('hex')
}

/**
 * Method that sends a request to the Beta API of customer.io
 *
 * @param   string  endPoint     The API end point to send request to. E.g. customer
 * @param   string  queryString  The query string to append to request URI.
 * @param   string  method       The method to send request. E.g. get, put, etc.
 * @param   object  postData     The data to send in request body.
 *
 * @return  Promise
 */
export function requestCustomerIoBetaApi(endPoint: string, queryString = '', method = 'get', postData = undefined) {
  return new Promise(async (resolve, reject) => {
    if (method !== 'get' && method !== 'post' && method !== 'put' && method !== 'delete') {
      return reject(`The provided method ${method} is invalid.`)
    }

    try {
      const res = await fetch(`${customerioBetaApiUrl}/${endPoint}${queryString ? `${queryString}` : ''}`, {
        method,
        headers: {
          ...headers,
          Authorization: `Bearer ${customerioBetaApiKey}`,
        },
        body: JSON.stringify(postData),
      })

      const data = await res.json()

      resolve(data)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Method that synchronizes user data to email profile at customer.io
 *
 * @param   string  email        Email address.
 * @param   object  customAttrs  Additional custom attributes to sync to email profile at customer.io
 *
 * @return  Promise
 */
export const syncUserDataToCustomerIo = (email: string, customAttrs = {}) => {
  return new Promise((resolve, reject) => {
    // Verify email.
    if (!email) {
      return reject('Email address is either missing or invalid.')
    }

    // Get email profile from customer.io
    requestCustomerIoBetaApi('customers', `?email=${encodeURIComponent(email)}`)
      .then(async (res: any) => {
        // Prepare results.
        const { results: profiles } = res
        // Init user data.
        const data = {
          email,
          ...customAttrs,
        }

        // Either add a new or update an existing email profile at customer.io
        const id = profiles?.[0] ? profiles[0].id : hashEmail(email)

        requestCustomerIoApi(`customers/${id}`, 'put', data)
          .then(() => resolve(id))
          .catch(reject)
      })
      .catch(reject)
  })
}
