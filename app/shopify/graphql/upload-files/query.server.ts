import { getConnectionArguments } from '../fns.server'
import type { ConnectionArguments } from '../types'

export const queryFiles = `
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      id
      alt
      createdAt
    }
  }
}`

export function queryForFiles(params: ConnectionArguments = {}): string {
  return `
    query {
      files(${getConnectionArguments(params).join(', ')}) {
        nodes {
          preview {
            image {
              url
            }
          }
        }
      }
    }`
}
