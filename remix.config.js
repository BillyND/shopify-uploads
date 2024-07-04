// Related: https://github.com/remix-run/remix/issues/2835#issuecomment-1144102176
// Replace the HOST env var with SHOPIFY_APP_URL so that it doesn't break the remix server. The CLI will eventually
// stop passing in HOST, so we can remove this workaround after the next major release.
if (process.env.HOST && (!process.env.SHOPIFY_APP_URL || process.env.SHOPIFY_APP_URL === process.env.HOST)) {
  process.env.SHOPIFY_APP_URL = process.env.HOST
  delete process.env.HOST
}

/** @type {import('@remix-run/dev').AppConfig} */
export default {
  future: {},
  appDirectory: 'app',
  devServerPort: 8002,
  serverModuleFormat: 'esm',
  ignoredRouteFiles: ['**/.*'],
  dev: { port: process.env.HMR_SERVER_PORT || 8002 },
  serverMinify: process.env.NODE_ENV === 'production',
  browserNodeBuiltinsPolyfill: { modules: { fs: true, path: true, url: true } },
  serverDependenciesToBundle: ['psd-vanilla-js', /^remix-utils.*/, '@shopify/polaris/build/esm/styles.css?url'],
}
