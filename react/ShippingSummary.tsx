import React from 'react'
import { PlaceDetails } from 'vtex.place-components'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedCurrency } from 'vtex.format-currency'

import useAddressRules from './useAddressRules'

const { useOrderShipping } = OrderShipping

const ShippingSummary: React.FC = () => {
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
      {selectedShippingOptions.map((shippingOption: any) => (
        <div className="mt5" key={shippingOption.id}>
          <span>
            {shippingOption.id} &ndash; {''}
            <FormattedCurrency value={shippingOption.price / 100} />
          </span>
          <p className="mv0">
            <TranslateEstimate shippingEstimate={shippingOption.estimate} />
          </p>
        </div>
      ))}
    </div>
  )
}

export default ShippingSummary
