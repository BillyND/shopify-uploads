import { BlockStack, Box, Spinner } from '@shopify/polaris'

export default function BlockLoading() {
  return (
    <Box paddingBlockStart={'2800'} paddingBlockEnd={'2800'}>
      <BlockStack inlineAlign="center" align="center">
        <Spinner size="large" />
      </BlockStack>
    </Box>
  )
}
