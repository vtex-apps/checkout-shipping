import React, { Fragment } from 'react'
import { AddressContext } from 'vtex.address-context'
import { PlaceDetails } from 'vtex.place-components'
import { OrderShipping } from 'vtex.order-shipping'
import { Address } from 'vtex.checkout-graphql'

const { useAddressContext } = AddressContext
const { useOrderShipping } = OrderShipping

interface Props {
  address: Address
}

const PickupPointAddress: React.FC<Props> = ({ address }) => {
  const { countries } = useOrderShipping()
  const { rules } = useAddressContext()

  return (
    <Fragment>
      <AddressContext.AddressContextProvider
        address={address}
        countries={countries}
        rules={rules}
      >
        <PlaceDetails />
      </AddressContext.AddressContextProvider>
    </Fragment>
  )
}

export default PickupPointAddress
