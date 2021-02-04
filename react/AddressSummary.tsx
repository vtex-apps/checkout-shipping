import React from 'react'
import { PlaceDetails } from 'vtex.place-components'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'

import useAddressRules from './useAddressRules'

const { useAddressContext } = AddressContext
const { useOrderShipping } = OrderShipping

const AddressSummary: React.VFC = () => {
  const { isValid } = useAddressContext()

  if (!isValid) {
    return null
  }

  return (
    <div className="c-muted-1 lh-copy">
      <PlaceDetails display="extended" />
    </div>
  )
}

const AddressSummaryWithAddress: React.VFC = () => {
  const { selectedAddress, countries } = useOrderShipping()

  const addressRules = useAddressRules()

  return (
    <AddressContext.AddressContextProvider
      address={selectedAddress!}
      countries={countries}
      rules={addressRules}
    >
      <AddressSummary />
    </AddressContext.AddressContextProvider>
  )
}

export default AddressSummaryWithAddress
