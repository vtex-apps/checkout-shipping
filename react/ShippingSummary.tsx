import React from 'react'
import { OrderShipping } from 'vtex.order-shipping'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedCurrency } from 'vtex.format-currency'
import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'

import { getName } from './utils/sla'

const { useOrderShipping } = OrderShipping

const ShippingSummary: React.FC = () => {
  const { deliveryOptions, pickupOptions } = useOrderShipping()

  const shippingOptions = [...deliveryOptions, ...pickupOptions]

  const selectedShippingOptions = shippingOptions.filter(
    ({ isSelected }) => isSelected
  )

  if (!selectedShippingOptions.length) {
    return null
  }

  return (
    <div className="c-muted-1 lh-copy">
      {selectedShippingOptions.map(
        (shippingOption: DeliveryOption | PickupOption) => (
          <div key={shippingOption.id}>
            <span>
              {getName(shippingOption)} &ndash; {''}
              <FormattedCurrency value={shippingOption.price / 100} />
            </span>
            <p className="mv0">
              <TranslateEstimate shippingEstimate={shippingOption.estimate} />
            </p>
          </div>
        )
      )}
    </div>
  )
}

export default ShippingSummary
