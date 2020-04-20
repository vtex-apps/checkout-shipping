import React from 'react'
import { AddressContext } from 'vtex.address-context'
import { PlaceDetails } from 'vtex.place-components'
import { Address } from 'vtex.checkout-graphql'
import { OrderShipping } from 'vtex.order-shipping'
import { FormattedMessage } from 'react-intl'

import { ListGroup, GroupOption } from './ListGroup'

interface Props {
  addresses: Address[]
  onCreateAddress?: () => void
  onAddressSelected?: () => void
}

const AddressList: React.FC<Props> = ({
  addresses,
  onCreateAddress = () => {},
  onAddressSelected = () => {},
}) => {
  const {
    countries,
    updateSelectedAddress,
    selectedAddress,
  } = OrderShipping.useOrderShipping()

  const handleSelectAddress = async (address: Address) => {
    await updateSelectedAddress(address)
    onAddressSelected()
  }

  return (
    <div>
      <span className="db fw6 lh-copy mb3">
        <FormattedMessage id="store/checkout.shipping.chooseAddress" />
      </span>
      <ListGroup>
        {addresses.map(address => (
          <GroupOption
            onClick={() => handleSelectAddress(address)}
            selected={address.addressId === selectedAddress.addressId}
            key={address.addressId!}
          >
            <AddressContext.AddressContextProvider
              address={address}
              countries={countries}
            >
              <PlaceDetails />
            </AddressContext.AddressContextProvider>
          </GroupOption>
        ))}
        <GroupOption onClick={onCreateAddress}>
          <FormattedMessage id="store/checkout.shipping.newAddressLabel" />
        </GroupOption>
      </ListGroup>
    </div>
  )
}

export default AddressList
