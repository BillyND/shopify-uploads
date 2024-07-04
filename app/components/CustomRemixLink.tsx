import { Link as RemixLink, useLocation, useNavigate } from '@remix-run/react'
import React from 'react'

// The flashing error when switching routes is due to Shopify, many people have encountered the same problem.
// See how to fix it here: https://github.com/Shopify/shopify-app-template-remix/issues/369
export default function CustomRemixLink({ children, to, ...rest }: any) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = React.useCallback(
    (to: any) => {
      history.pushState({}, '', to)
      navigate(to)
    },
    [navigate]
  )

  return (
    <>
      <RemixLink
        key={location?.key || ''}
        to={to}
        {...rest}
        onClick={e => {
          e.preventDefault()
          handleNavigation(to)
        }}
      >
        {children}
      </RemixLink>
    </>
  )
}
