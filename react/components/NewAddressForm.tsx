import React, { Fragment } from 'react'
import {
  DeviceCoordinates,
  LocationInput,
  LocationCountry,
} from 'vtex.place-components'
import { Address } from 'vtex.places-graphql'

interface Props {
  onAddressCreated: (address: Address) => void
}

const NewAddressForm: React.FC<Props> = ({ onAddressCreated }) => {
  return (
    <Fragment>
      <div className="pv3">
        <DeviceCoordinates />
      </div>
      <div className="mt6 w-100 mw6">
        <LocationCountry />
      </div>
      <div className="mt6 w-100 mw5">
        <LocationInput onSuccess={onAddressCreated} variation="primary" />
      </div>
    </Fragment>
  )
}

export default NewAddressForm
