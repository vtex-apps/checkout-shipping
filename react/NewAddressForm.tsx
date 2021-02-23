import React from 'react'
import {
  DeviceCoordinates,
  LocationInput,
  LocationCountry,
  LocationSearch,
} from 'vtex.place-components'
import type { Address } from 'vtex.places-graphql'
import { FormattedMessage } from 'react-intl'
import { ListGroup } from 'vtex.checkout-components'
import { Loading } from 'vtex.render-runtime'
import { useGeolocationEnabled } from 'vtex.checkout-resources'

import ShippingHeader from './ShippingHeader'
import { ShippingOptionPreview } from './ShippingOption'
import ShippingEditError from './components/ShippingEditError'

interface Props {
  onAddressCreated: (address: Address) => void
  onRetryCreateAddress?: () => void
  onEditAddress?: () => void
  onViewAddressList?: () => void
  isSubmitting: boolean
  hasError: boolean
  hasAvailableAddresses: boolean
}

const NewAddressForm: React.FC<Props> = ({
  onAddressCreated,
  onRetryCreateAddress = () => {},
  onEditAddress = () => {},
  onViewAddressList = () => {},
  isSubmitting,
  hasError,
  hasAvailableAddresses,
}) => {
  const [geolocationEnabled, loading] = useGeolocationEnabled()

  if (loading) {
    return <Loading />
  }

  if (hasError) {
    return (
      <ShippingEditError
        onEditAddress={onEditAddress}
        onTryAgain={onRetryCreateAddress}
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
    <>
      <p className="t-body mt0 mb6">
        <FormattedMessage id="store/checkout.shipping.informAddress" />
      </p>

      <div>
        <DeviceCoordinates onSuccess={onAddressCreated} />
      </div>

      <LocationCountry className="w-100 mw6 mt6" />

      {!geolocationEnabled ? (
        <div className="mt6 w-100 mw5">
          <LocationInput onSuccess={onAddressCreated} variation="primary" />
        </div>
      ) : (
        <div className="mt6 w-100 mw6">
          <LocationSearch onSelectAddress={onAddressCreated} />
        </div>
      )}

      {hasAvailableAddresses && (
        <div className="mt6">
          <FormattedMessage
            id="store/checkout.shipping.backToAddressList"
            values={{
              // eslint-disable-next-line react/display-name
              a: (chunks: any) => {
                return (
                  <button
                    className="bn bg-transparent pa0 c-action-primary pointer"
                    onClick={onViewAddressList}
                  >
                    {chunks}
                  </button>
                )
              },
            }}
          />
        </div>
      )}
    </>
  )
}

export default NewAddressForm
