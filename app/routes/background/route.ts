import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
  // Verify request
  const { searchParams } = new URL(request.url)
  const lookupTime = searchParams.get('resume') ? 2 : 1

  if (searchParams.get('token') !== (process.env.SECRET_TOKEN || 'undefined')) {
    throw json({ code: 401, message: 'Forbidden' })
  }

  // Define a variable to hold shop access tokens
  const sessions: any = {}

  // Push the billing attempt creation task to the background
  setTimeout(async () => {}, 100)

  return json({ success: true })
}
