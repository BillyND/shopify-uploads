import crypto from 'crypto'
import { APP_PROXY_ACTIONS } from './constants'

export async function createHashMd5(data: string) {
  const hash = crypto.createHash('md5')
  hash.update(data)
  return hash.digest('hex')
}

/**
 * Function to refine HTML content by replacing placeholders with actual values.
 * @param {string} rawHtmlContent - The raw HTML content with placeholders.
 * @returns {string} The refined HTML content with placeholders replaced.
 */
export function refineHtmlContent(rawHtmlContent: string): string {
  const keysMapping: { [key: string]: string } = {
    APP_PROXY_PATH: process.env.APP_PROXY_PATH || '',
    'APP_PROXY_ACTIONS.UPLOAD_FILES': APP_PROXY_ACTIONS.UPLOAD_FILES,
  }

  let refinedHtmlContent = rawHtmlContent

  for (const [placeholder, replacement] of Object.entries(keysMapping)) {
    refinedHtmlContent = refinedHtmlContent.replace(new RegExp(placeholder, 'g'), replacement)
  }

  return refinedHtmlContent
}
