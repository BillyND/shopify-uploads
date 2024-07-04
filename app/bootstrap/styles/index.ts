import polarisStyles from '@shopify/polaris/build/esm/styles.css?url'
import buttonHasChildElementStyles from '../../components/custom-polaris/ButtonHasChildElement/styles.css?url'
import globalStyles from './global.css?url'
import flexStyles from '../../components/custom-polaris/Flex/styles.css?url'

/** @Do_not_import_dynamically_otherwise_the_live_app_will_crash */
const linkStyles = () => [
  { rel: 'stylesheet', href: polarisStyles },
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: buttonHasChildElementStyles },
  { rel: 'stylesheet', href: flexStyles },
]

export default linkStyles
