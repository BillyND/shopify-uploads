import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { AppProvider, Button, Card, FormLayout, Page, Text, TextField } from '@shopify/polaris'
import type { LoginError } from '@shopify/shopify-app-remix'
import { useState } from 'react'
import { rootPage } from '~/bootstrap/app-config'
import type { WithTranslationProps } from '~/bootstrap/hoc/withTranslation'
import withTranslation from '~/bootstrap/hoc/withTranslation'
import { MAX_INPUT_LENGTH } from '~/constants'
import { loginErrorMessage } from '~/routes/auth.login/error.server'
import { login } from '~/shopify.server'

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const errors = loginErrorMessage(await login(request).catch((): LoginError => ({ shop: undefined })))

  if (url.searchParams.get('shop')) {
    throw redirect(`${rootPage}?${url?.searchParams?.toString()}`)
  }

  return json({
    errors,
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const errors = loginErrorMessage(await login(request))

  if (errors?.shop) {
    return json({ errors })
  }

  const data = Object.fromEntries(await request.formData())

  throw redirect(`${rootPage}?shop=${data?.shop}`)
}

export default withTranslation(function Auth(props: WithTranslationProps) {
  const { t } = props
  const [shop, setShop] = useState('')
  const loaderData = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const { errors } = actionData || loaderData

  return (
    <AppProvider i18n={{}}>
      <Page>
        <Card>
          <Form method="post">
            <FormLayout>
              <Text variant="headingMd" as="h2">
                {t('login')}
              </Text>
              <TextField
                max={MAX_INPUT_LENGTH}
                type="text"
                name="shop"
                label={t('shop-domain')}
                suffix=".myshopify.com"
                helpText="example.myshopify.com"
                value={shop}
                onChange={setShop}
                autoComplete="on"
                error={errors?.shop}
              />
              <Button submit>{t('login')}</Button>
            </FormLayout>
          </Form>
        </Card>
      </Page>
    </AppProvider>
  )
})
