import React from 'react'
import { AddressContext } from 'vtex.address-context'
import { PlaceDetails } from 'vtex.place-components'
import type { Address } from 'vtex.checkout-graphql'
import { OrderShipping } from 'vtex.order-shipping'
import { FormattedMessage } from 'react-intl'
import { ListGroup, GroupOption } from 'vtex.checkout-components'

import ShippingHeader from '../ShippingHeader'
import { ShippingOptionPreview } from '../ShippingOption'
import ShippingEditError from './ShippingEditError'

const { useAddressContext } = AddressContext
const { useOrderShipping } = OrderShipping

interface Props {
  addresses: Address[]
  onCreateAddress?: () => void
  onAddressSelected?: (address: Address) => void
  onRetrySelectAddress?: () => void
  onEditAddress?: () => void
  selectedAddress: Address | null
  isSubmitting: boolean
  hasError: boolean
}

const AddressList: React.FC<Props> = ({
  addresses,
  onEditAddress = () => {},
  onCreateAddress = () => {},
  onRetrySelectAddress = () => {},
  onAddressSelected = () => {},
  selectedAddress,
  isSubmitting,
  hasError,
}) => {
  const { countries } = useOrderShipping()
  const { rules } = useAddressContext()

  if (hasError) {
    return (
      <ShippingEditError
        onEditAddress={onEditAddress}
        onTryAgain={onRetrySelectAddress}
      />
    )
  }

  if (isSubmitting) {
    return (
      <>
        <ShippingHeader onEditAddress={onEditAddress} />

        <ListGroup>
          <ShippingOptionPreview />
          <ShippingOptionPreview />
          <ShippingOptionPreview />
        </ListGroup>
      </>
    )
  }

  return (
    <div>
      <span className="db fw6 lh-copy mb3">
        <FormattedMessage id="store/checkout.shipping.chooseAddress" />
      </span>
      <ListGroup>
        {addresses.map((address, id) => (
          <GroupOption
            onClick={() => onAddressSelected(address)}
            selected={address.addressId === selectedAddress?.addressId}
            key={`${address?.addressId}-${id}`}
          >
            <AddressContext.AddressContextProvider
              address={address}
              countries={countries}
              rules={rules}
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
