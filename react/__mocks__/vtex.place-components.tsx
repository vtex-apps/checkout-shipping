import React from 'react'
import { AddressContext } from 'vtex.address-context'

const { useAddressContext } = AddressContext

export const PlaceDetails: React.FC = () => {
  const { address } = useAddressContext()

  return <div>{JSON.stringify(address, null, 2)}</div>
}
