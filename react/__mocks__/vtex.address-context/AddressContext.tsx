import React, { createContext, useContext, useMemo } from 'react'
import type { AddressRules } from 'vtex.address-context/react/types'
import type { Address } from 'vtex.checkout-graphql'

interface Props {
  address: Address | null
  countries: string[]
  rules: AddressRules
}

const AddressContextContext = createContext<Props | undefined>(undefined)

const AddressContextProvider: React.FC<Props> = ({
  children,
  address,
  countries,
  rules,
}) => {
  const state = useMemo(() => ({ address, countries, rules }), [
    address,
    countries,
    rules,
  ])

  return (
    <AddressContextContext.Provider value={state}>
      {children}
    </AddressContextContext.Provider>
  )
}

const useAddressContext = () => useContext(AddressContextContext)

export const AddressContext = { AddressContextProvider, useAddressContext }
