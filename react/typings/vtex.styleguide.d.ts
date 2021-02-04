import React from 'react'

declare module 'vtex.styleguide' {
  const IconCaretRight: React.FC

  interface IconEditProps {
    solid?: boolean
  }

  const IconEdit: React.FC<IconEditProps>

  const IconDelete: React.FC

  const Button: React.FC<any>

  const Checkbox: React.FC<any>

  const Input: React.FC<any>

  const Alert: React.FC<any>
}
