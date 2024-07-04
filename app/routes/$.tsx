import type { WithTranslationProps } from '~/bootstrap/hoc/withTranslation'
import withTranslation from '~/bootstrap/hoc/withTranslation'
import { useEffect } from 'react'
import { Page } from '@shopify/polaris'
import { useNavigate } from '@remix-run/react'
import { rootPage } from '~/bootstrap/app-config'

export default withTranslation(function PageNotFound(props: WithTranslationProps) {
  const { t } = props
  const navigate = useNavigate()

  useEffect(() => {
    navigate(rootPage)
  }, [navigate])

  return <Page>{t('page-not-found-')}</Page>
})
