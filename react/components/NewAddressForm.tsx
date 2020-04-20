import React, { useCallback, Fragment } from 'react'
import {
  DeviceCoordinates,
  LocationInput,
  LocationCountry,
} from 'vtex.place-components'
import { OrderShipping } from 'vtex.order-shipping'
import { Address } from 'vtex.places-graphql'

interface Props {
  onAddressCreated?: () => void
}

const NewAddressForm: React.FC<Props> = ({ onAddressCreated = () => {} }) => {
  const { insertAddress } = OrderShipping.useOrderShipping()

  const handleAddressUpdate = useCallback(
    async (address: Address) => {
      await insertAddress(address)
      onAddressCreated()
    },
    [insertAddress, onAddressCreated]
  )

  return (
    <Fragment>
      <div className="pv3">
        <DeviceCoordinates />
      </div>
      <div className="mt6 w-100 mw6">
        <LocationCountry />
      </div>
      <div className="mt6 w-100 mw5">
        <LocationInput onSuccess={handleAddressUpdate} variation="primary" />
      </div>
    </Fragment>
  )
}

export default NewAddressForm
