import buttonHasChildElementStyles from '../../components/custom-polaris/ButtonHasChildElement/styles.css?url'
import globalStyles from './global.css?url'

/** @Do_not_import_dynamically_otherwise_the_live_app_will_crash */
const linkStyles = () => [
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'stylesheet', href: buttonHasChildElementStyles },
]

export default linkStyles
