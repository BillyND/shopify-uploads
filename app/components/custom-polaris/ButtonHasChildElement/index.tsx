import React from 'react'
import type { ButtonProps } from '@shopify/polaris'
import { Button } from '@shopify/polaris'

interface IButtonHasChildElement extends Omit<ButtonProps, 'children' | 'onClick' | 'removeUnderline'> {
  children?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  removeUnderline?: boolean
}

export default function ButtonHasChildElement(props: IButtonHasChildElement) {
  const { children, removeUnderline, ...restProps } = props

  const className = removeUnderline ? 'wrap-button' : ''

  return (
    <div className={className}>
      {/* @ts-ignore */}
      <Button {...restProps}>{children}</Button>
    </div>
  )
}
