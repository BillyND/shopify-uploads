import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticate } from '~/shopify.server'
import { ShopifyApiClient } from '~/shopify/graphql/api.server'
import { APP_PROXY_ACTIONS } from './constants'
import { refineHtmlContent } from './fns'
import axios from 'axios'
import { sleep } from '~/bootstrap/fns/time'

// Define the necessary TypeScript interfaces
interface StagedUploadInput {
  resource: string
  httpMethod: string
  filename: string
  mimeType: string
}

interface StagedUploadParameter {
  name: string
  value: string
}

interface StagedUploadTarget {
  url: string
  resourceUrl: string
  parameters: StagedUploadParameter[]
}

interface StagedUploadsCreateResponse {
  stagedTargets: StagedUploadTarget[]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Authenticate and get the liquid processing function
  const { liquid } = await authenticate.public.appProxy(request)

  // Get the current filename and directory
  const currentFilename = fileURLToPath(import.meta.url)
  const currentDirectory = path.dirname(currentFilename)

  // Resolve paths to the HTML and CSS files
  const htmlFilePath = path.resolve(currentDirectory, '../app/routes/api/components/upload-files.html')
  const htmlContent = await fs.readFile(htmlFilePath, 'utf-8')

  // Refine the HTML content
  const refinedHtmlContent = refineHtmlContent(htmlContent)

  // Return the combined style and content processed by liquid
  return liquid(refinedHtmlContent)
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = (await authenticate.public.appProxy(request)) || {}

  if (!admin) {
    return { success: false, message: 'Admin authentication fails!' }
  }

  const shopifyApiClient = new ShopifyApiClient(admin)
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const formData: any = Object.fromEntries(await request.formData())

  switch (action) {
    case APP_PROXY_ACTIONS.UPLOAD_FILES: {
      const uploadInput: StagedUploadInput[] = [
        {
          resource: 'IMAGE',
          httpMethod: 'POST',
          filename: formData?.file?.name,
          mimeType: formData?.file?.type,
        },
      ]

      const { stagedTargets } = (await shopifyApiClient.stagedUploadsCreate(uploadInput)) as StagedUploadsCreateResponse
      const target = stagedTargets[0]
      const { url, resourceUrl, parameters } = target

      const uploadForm = new FormData()
      const headers: HeadersInit = { 'Content-Type': 'multipart/related' }

      parameters.forEach(({ name, value }) => uploadForm.append(name, value))
      uploadForm.append('file', formData?.file)

      if (url.includes('amazon')) {
        headers['Content-Length'] = (formData?.file?.size ?? 0) + 5000
      }

      await axios.post(url, uploadForm, {
        headers: {
          ...headers,
        },
      })

      const prepareFile: any = {
        alt: formData?.file?.name,
        contentType: 'IMAGE',
        originalSource: resourceUrl,
      }

      const { files } = (await shopifyApiClient.uploadFiles(prepareFile)) || {}

      await sleep(1500)

      const [
        {
          preview: {
            image: { url: imageUrl },
          },
        },
      ] = (await shopifyApiClient.getFilesByIds([files?.[0]?.id])) || [
        {
          preview: {
            image: { url: '' },
          },
        },
      ]

      return {
        success: true,
        message: 'Files uploaded successfully',
        imageUrl,
      }
    }
    default: {
      return { success: false, message: 'Invalid action specified' }
    }
  }
}
