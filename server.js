import fs from 'fs'
import cors from 'cors'
import path from 'path'
import https from 'https'
import dotenv from 'dotenv'
import morgan from 'morgan'
import express from 'express'
import fetch from 'node-fetch'
import compression from 'compression'
import remix from '@remix-run/express'
import { fileURLToPath } from 'url'
import { logDevReady } from '@remix-run/node'

// Get the resolved path to the file
const __filename = fileURLToPath(import.meta.url)

// Get the name of the directory
const __dirname = path.dirname(__filename)

// Load environment directives
dotenv.config({ path: path.resolve(__dirname, './.env') })

// Get path to build directory
const BUILD_DIR = path.resolve(__dirname, 'build/index.js')

// Instantiate an Express app
const app = express()

// Load support for CORS, cookie parser, etc.
app.use(cors())
app.use(compression())
app.use(morgan('tiny'))
app.use(express.static('public', { maxAge: '1h' }))
app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }))

// Remove X-Powered-By header
app.disable('x-powered-by')

// Init Remix request handler
const build = await import(BUILD_DIR)

app.all(
  '*',
  remix.createRequestHandler({
    build,
    mode: build.mode,
  })
)

// Create a server to serve the app
let server
const port = process.env.PORT || 3000
const httpsPort = process.env.HTTPS_PORT || 443
const enable_https = process.env.HTTPS === 'true'

if (enable_https) {
  const ssl_key_path = path.resolve(__dirname, './', process.env.SSL_KEY || '')
  const ssl_crt_path = path.resolve(__dirname, './', process.env.SSL_CRT || '')

  if (fs.existsSync(ssl_key_path) && fs.existsSync(ssl_crt_path)) {
    server = https.createServer(
      {
        key: fs.readFileSync(ssl_key_path),
        cert: fs.readFileSync(ssl_crt_path),
      },
      app
    )

    server.listen(httpsPort, () => {
      console.info(`%s App listening on https port: ${httpsPort}`, '✓')
    })
  } else {
    console.info('No HTTPS!')
  }
} else {
  server = app.listen(port, async () => {
    console.info(`🤗 ${process.env.APP_NAME} server is running at PORT:`, port)
  })

  if (process.env.NODE_ENV === 'development') {
    logDevReady(build)
  }
}

// Define a function to trigger background tasks
async function triggerBackgroundProcess(resume = false) {
  const searchParams = `token=${process.env.SECRET_TOKEN}${resume ? '&resume=1' : ''}`

  console.log(await fetch(`${process.env.SHOPIFY_APP_URL}/background?${searchParams}`).then(res => res.json()))
}

// Trigger background tasks right after (re-)starting the server
await triggerBackgroundProcess(true)

// Create an interval to periodically trigger background tasks every 1 hour
// setInterval(async () => await triggerBackgroundProcess(), 1 * 60 * 60 * 1000)
