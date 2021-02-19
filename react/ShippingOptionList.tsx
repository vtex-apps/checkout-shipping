import React, { useMemo } from 'react'
import type { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'
import { Alert } from 'vtex.styleguide'
import { ListGroup } from 'vtex.checkout-components'
import { getFastestSla, getCheapestSla } from '@vtex/estimate-calculator'
import { FormattedMessage } from 'react-intl'

import ShippingOption from './ShippingOption'
import { isPickupOption } from './utils/sla'

interface Props {
  deliveryOptions: DeliveryOption[]
  pickupOptions: PickupOption[]
  onDeliveryOptionSelected?: (id: string) => void
  onDeliveryOptionDeselected?: (id: string) => void
  onPickupOptionSelected?: (id: string) => void
  onPickupOptionDeselected?: (id: string) => void
  showOnlySelectedShippingOption?: boolean
}

const ShippingOptionList: React.FC<Props> = ({
  deliveryOptions,
  pickupOptions = [],
  onDeliveryOptionSelected = () => {},
  onDeliveryOptionDeselected = () => {},
  onPickupOptionSelected = () => {},
  onPickupOptionDeselected = () => {},
  showOnlySelectedShippingOption = false,
}) => {
  const shippingOptions = useMemo(
    () => [...deliveryOptions, ...pickupOptions.slice(0, 1)],
    [deliveryOptions, pickupOptions]
  )

  const handleShippingOptionSelect = (
    shippingOption: DeliveryOption | PickupOption
  ) => {
    if (isPickupOption(shippingOption)) {
      onPickupOptionSelected(shippingOption.id)
    } else {
      onDeliveryOptionSelected(shippingOption.id!)
    }
  }

  const handleDeliveryOptionDeselect = (deliveryOption: DeliveryOption) => {
    onDeliveryOptionDeselected(deliveryOption.id!)
  }

  const handlePickupOptionDeselect = (pickupOption: PickupOption) => {
    onPickupOptionDeselected(pickupOption.id!)
  }

  const fastestOption = useMemo(() => {
    return getFastestSla(
      deliveryOptions.map(({ id, estimate, price }) => ({
        id: id!,
        shippingEstimate: estimate!,
        price,
      }))
    )
  }, [deliveryOptions])

  const cheapestOption = useMemo(() => {
    return getCheapestSla(
      deliveryOptions.map(({ id, estimate, price }) => ({
        id: id!,
        shippingEstimate: estimate!,
        price,
      }))
    )
  }, [deliveryOptions])

  const selectedShippingOptions = useMemo(() => {
    return shippingOptions.filter(({ isSelected }) => isSelected)
  }, [shippingOptions])

  return shippingOptions.length > 0 ? (
    showOnlySelectedShippingOption ? (
      <>
        <p className="mt0 mb5 fw4 f4 lh-copy">
          <FormattedMessage id="store/checkout.shipping.selectedDeliveryOptionsLabel" />
        </p>

        <ListGroup borderPosition="none">
          {selectedShippingOptions.map((shippingOption) => (
            <ShippingOption
              key={shippingOption.id}
              shippingOption={shippingOption}
              fastestOption={fastestOption}
              cheapestOption={cheapestOption}
              onDeselectShippingOption={() => {
                if (isPickupOption(shippingOption)) {
                  handlePickupOptionDeselect(shippingOption)
                } else {
                  handleDeliveryOptionDeselect(shippingOption)
                }
              }}
              isSelected
            />
          ))}
        </ListGroup>
      </>
    ) : (
      <ListGroup>
        {shippingOptions.map((shippingOption) => (
          <ShippingOption
            key={shippingOption.id}
            shippingOption={shippingOption}
            fastestOption={fastestOption}
            cheapestOption={cheapestOption}
            onSelectShippingOption={() => {
              handleShippingOptionSelect(shippingOption)
            }}
          />
        ))}
      </ListGroup>
    )
  ) : (
    <Alert type="warning">
      <FormattedMessage id="store/checkout.shipping.emptyDeliveryOptionsAlert" />
    </Alert>
  )
}

export default ShippingOptionList
