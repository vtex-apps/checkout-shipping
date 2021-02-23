import React, { useEffect } from 'react'
import { PlaceDetails } from 'vtex.place-components'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'
import { OrderForm } from 'vtex.order-manager'
import { Loading } from 'vtex.render-runtime'

import useAddressRules from './useAddressRules'

const { useAddressContext } = AddressContext
const { useOrderShipping } = OrderShipping
const { useOrderForm } = OrderForm

const AddressSummary: React.VFC = () => {
  const { selectedAddress } = useOrderShipping()
  const { address, setAddress, isValid } = useAddressContext()
  const {
    orderForm: { canEditData },
  } = useOrderForm()

  useEffect(() => {
    if (selectedAddress == null) {
      return
    }

    setAddress(selectedAddress)
  }, [selectedAddress, setAddress])

  const shouldConsiderValidation =
    (address.isDisposable ?? false) || canEditData

  if (shouldConsiderValidation && !isValid) {
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

  if (selectedAddress != null && addressRules == null) {
    return <Loading />
  }

  return (
    <AddressContext.AddressContextProvider
      address={selectedAddress!}
      countries={countries}
      rules={addressRules ?? {}}
    >
      <AddressSummary />
    </AddressContext.AddressContextProvider>
  )
}

export default AddressSummaryWithAddress
