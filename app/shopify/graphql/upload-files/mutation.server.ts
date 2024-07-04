export const mutationCreateFiles = `
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      id
      alt
      createdAt
    }
  }
}`

export const mutationStagedUploadsCreate = `
mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
  stagedUploadsCreate(input: $input) {
    stagedTargets {
      url
      resourceUrl
      parameters {
        name
        value
      }
    }
  }
}
`
