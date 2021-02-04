import React from 'react'
import { PlaceDetails } from 'vtex.place-components'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'

import useAddressRules from './useAddressRules'

const { useOrderShipping } = OrderShipping

const AddressSummary: React.VFC = () => {
  const {
    selectedAddress,
    countries,
    deliveryOptions,
    pickupOptions,
  } = useOrderShipping()

  const addressRules = useAddressRules()

  const shippingOptions = [...deliveryOptions, ...pickupOptions]

  const selectedShippingOptions = shippingOptions.filter(
    ({ isSelected }) => isSelected
  )

  if (!selectedShippingOptions.length) {
    return null
  }

  return (
    <div className="c-muted-1 lh-copy">
      <AddressContext.AddressContextProvider
        address={selectedAddress!}
        countries={countries}
        rules={addressRules}
      >
        <PlaceDetails display="extended" />
      </AddressContext.AddressContextProvider>
    </div>
  )
}

export default AddressSummary
