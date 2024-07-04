import { Outlet } from '@remix-run/react'
import { NavMenu } from '@shopify/app-bridge-react'
import type { ComponentClass, FunctionComponent } from 'react'
import { useMemo } from 'react'
import { isNavMenuItemEnabled } from '~/bootstrap/app-config'
import type { WithTranslationProps } from '~/bootstrap/hoc/withTranslation'
import withTranslation from '~/bootstrap/hoc/withTranslation'
import CustomRemixLink from '~/components/CustomRemixLink'

export default function withNavMenu(
  Component?: FunctionComponent<WithTranslationProps> | ComponentClass<WithTranslationProps>
) {
  return withTranslation(function WithNavMenu(props: any) {
    const { t } = props

    // Define nav menu items.
    const navMenuItems: { [key: string]: string } = useMemo(
      () => ({
        '/dashboard': t('dashboard'),
        '/files': t('files'),
      }),
      [t]
    )

    // Filter enabled nav menu items.
    const filteredNavMenuItems = useMemo(
      () => Object.keys(navMenuItems).filter(path => isNavMenuItemEnabled(path)),
      [navMenuItems]
    )

    return (
      <>
        <NavMenu>
          {filteredNavMenuItems.map(path => (
            <CustomRemixLink key={path} to={path} rel={path === '/dashboard' ? 'home' : undefined}>
              {navMenuItems[path]}
            </CustomRemixLink>
          ))}
        </NavMenu>

        {Component ? <Component {...props} /> : <Outlet />}
      </>
    )
  })
}
