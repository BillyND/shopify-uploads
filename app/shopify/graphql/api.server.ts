import type { AdminApiContext } from 'node_modules/@shopify/shopify-app-remix/dist/ts/server/clients'
import type { GraphQLResponse } from 'node_modules/@shopify/shopify-app-remix/dist/ts/server/clients/types'
import { getObjectByKeyPath } from '~/bootstrap/fns/misc'
import { getIdNumberFromIdString } from '../fns'
import { mutationCreateFiles, mutationStagedUploadsCreate } from './upload-files/mutation.server'
import { queryForFiles } from './upload-files/query.server'

export class ShopifyApiClient {
  admin: AdminApiContext

  constructor(admin: AdminApiContext) {
    this.admin = admin
  }

  async uploadFiles(files: any[]) {
    return this.verifyResponse(await this.admin.graphql(mutationCreateFiles, { variables: { files } }), 'fileCreate')
  }

  async getFilesByIds(fileIds: string[]) {
    return this.verifyResponse(
      await this.admin.graphql(queryForFiles({ query: convertIdsToQuery(fileIds) })),
      'files.nodes'
    )
  }

  async stagedUploadsCreate(input: any) {
    return this.verifyResponse(
      await this.admin.graphql(mutationStagedUploadsCreate, { variables: { input } }),
      'stagedUploadsCreate'
    )
  }

  async verifyResponse(result: GraphQLResponse<any, any>, dataKeyPath?: string) {
    const _result = await result.json()
    const data = dataKeyPath ? getObjectByKeyPath(_result, `data.${dataKeyPath}`) : _result.data

    if (!data || data?.userErrors?.length) {
      throw new Error(data?.userErrors?.[0]?.message || 'UNKNOWN')
    }

    return data
  }
}

export function convertIdsToQuery(ids: string[]): string {
  try {
    // Extract the numeric ID from each GID and format them into the desired query format
    return ids?.map(id => `(id:${getIdNumberFromIdString(id)})`).join(' OR ')
  } catch (e) {
    console.error(e)
    return ''
  }
}
