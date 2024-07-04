import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'
import { AppProvider, BlockStack, Button, Card, FormLayout, Layout, Page, Text, TextField } from '@shopify/polaris'
import { useState } from 'react'
import { rootPage } from '~/bootstrap/app-config'
import type { WithTranslationProps } from '~/bootstrap/hoc/withTranslation'
import withTranslation from '~/bootstrap/hoc/withTranslation'
import { MAX_INPUT_LENGTH } from '~/constants'
import { loginErrorMessage } from '~/routes/auth.login/error.server'
import { login } from '~/shopify.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)

  if (url?.searchParams?.get('shop')) {
    throw redirect(`${rootPage}?${url.searchParams.toString()}`)
  }

  return json({ showForm: Boolean(login) })
}

export async function action({ request }: ActionFunctionArgs) {
  const errors = loginErrorMessage(await login(request))

  if (errors.shop) {
    return json({ errors })
  }

  const data = Object.fromEntries(await request.formData())

  throw redirect(`${rootPage}?shop=${data?.shop}`)
}

export default withTranslation(function App(props: WithTranslationProps) {
  const { t } = props
  const { showForm } = useLoaderData<typeof loader>()
  const [shop, setShop] = useState<string>('')

  return (
    <AppProvider i18n={{}}>
      <Page fullWidth>
        <Layout>
          <Layout.Section>
            <div style={{ width: 'min(90vw, 480px)', transform: 'translateY(calc(50vh - 160px))', margin: 'auto' }}>
              {showForm && (
                <Form method="post">
                  <FormLayout>
                    <BlockStack align="center" inlineAlign="center" gap="100">
                      <Text as="h1" variant="heading2xl">
                        {t('Upload Images')}
                      </Text>
                      <Text as="p" variant="bodyMd">
                        {t('Up load images into Shopify')}
                      </Text>
                    </BlockStack>
                    <Card>
                      <BlockStack gap={'400'}>
                        <TextField
                          max={MAX_INPUT_LENGTH}
                          label={'Store name'}
                          autoComplete="off"
                          value={shop}
                          type="text"
                          name="shop"
                          onChange={setShop}
                          suffix=".myshopify.com"
                        />
                        <Button fullWidth submit disabled={!shop} variant="primary">
                          {t('login')}
                        </Button>
                      </BlockStack>
                    </Card>
                  </FormLayout>
                </Form>
              )}
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    </AppProvider>
  )
})
