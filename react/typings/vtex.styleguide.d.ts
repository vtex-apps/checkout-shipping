import type React from 'react'

declare module 'vtex.styleguide' {
  const IconCaretRight: React.FC

  interface IconEditProps {
    solid?: boolean
  }

  const IconEdit: React.FC<IconEditProps>

  const IconDelete: React.FC

  const IconInfo: React.FC

  const Button: React.FC<any>

  const Checkbox: React.FC<any>

  const Toggle: React.FC<any>

  const Tooltip: React.FC<any>

  const Input: React.FC<any>

  const Alert: React.FC<any>

  const Modal: React.FC<any>

  const Divider: React.FC<any>
}
