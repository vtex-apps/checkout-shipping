import React from 'react'
import { PlaceDetails } from 'vtex.place-components'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedCurrency } from 'vtex.format-currency'

const ShippingSummary: React.FC = () => {
  const {
    selectedAddress,
    countries,
    deliveryOptions,
  } = OrderShipping.useOrderShipping()

  const selectedDeliveryOptions = deliveryOptions.filter(
    ({ isSelected }: { isSelected: boolean }) => isSelected
  )

  if (!selectedDeliveryOptions.length) {
    return null
  }

  return (
    <div className="c-muted-1 lh-copy">
      <AddressContext.AddressContextProvider
        address={selectedAddress}
        countries={countries}
      >
        <PlaceDetails display="extended" />
      </AddressContext.AddressContextProvider>
      {selectedDeliveryOptions.map((deliveryOption: any) => (
        <div className="mt5" key={deliveryOption.id}>
          <span>
            {deliveryOption.id} &ndash; {''}
            <FormattedCurrency value={deliveryOption.price / 100} />
          </span>
          <p className="mv0">
            <TranslateEstimate shippingEstimate={deliveryOption.estimate} />
          </p>
        </div>
      ))}
    </div>
  )
}

export default ShippingSummary
