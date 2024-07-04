/* eslint-disable max-len */
import React from 'react'

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The direction to stack the items.
   * @default 'row'
   */
  direction?: 'row' | 'column'
  /**
   * The alignment of the items along the main axis.
   * @default 'start'
   */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /**
   * The alignment of the items along the cross axis.
   * @default 'stretch'
   */
  alignContent?: 'start' | 'center' | 'end' | 'stretch'
  /**
   * The spacing between the items.
   * @default 'loose'
   */
  gap?: '0' | '050' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '1000'
  /**
   * The distribution of the items along the main axis.
   * @default 'start'
   */
  justify?: 'start' | 'center' | 'end' | 'around' | 'between'
  /**
   * The wrapping behaviour of the items.
   * @default 'noWrap'
   */
  wrap?: 'noWrap' | 'wrap' | 'wrapReverse'
  children?: React.ReactNode
}

export const Flex = (props: FlexProps) => {
  const {
    direction = 'row',
    align = 'start',
    alignContent = 'stretch',
    gap = '0',
    justify = 'start',
    wrap = 'noWrap',
    children,
    ...rest
  } = props

  return (
    <div
      className={`flex flex-${direction} items-${align} content-${alignContent} gap-${gap} justify-${justify} wrap-${wrap}`}
      {...rest}
    >
      {children}
    </div>
  )
}
