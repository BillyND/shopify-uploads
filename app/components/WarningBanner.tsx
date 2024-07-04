import type { BannerProps } from '@shopify/polaris'
import { Banner, List } from '@shopify/polaris'

export type WarningBannerContent = {
  warnings: string[]
  title: string
  tone?: BannerProps['tone']
}

function WarningBanner(props: WarningBannerContent) {
  const { warnings, title, tone } = props

  return !warnings?.length ? null : (
    <Banner title={title} tone={tone || 'critical'}>
      <List type="bullet">
        {warnings.map((content: string, index: number) => {
          return <List.Item key={`warning-banner-${index}-${content}`}>{content}</List.Item>
        })}
      </List>
    </Banner>
  )
}

export default WarningBanner
