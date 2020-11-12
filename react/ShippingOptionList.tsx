import React, { useMemo, useState } from 'react'
import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'
import { Alert } from 'vtex.styleguide'
import { ListGroup } from 'vtex.checkout-components'
import { getFastestSla, getCheapestSla } from '@vtex/estimate-calculator'
import { FormattedMessage } from 'react-intl'

import ShippingOption from './ShippingOption'

interface Props {
  deliveryOptions: DeliveryOption[]
  pickupOptions: PickupOption[]
  onDeliveryOptionSelected?: (id: string) => void
  onDeliveryOptionDeselected?: (id: string) => void
  onPickupOptionSelected?: (id: string) => void
}

const ShippingOptionList: React.FC<Props> = ({
  deliveryOptions,
  pickupOptions,
  onDeliveryOptionSelected = () => {},
  onDeliveryOptionDeselected = () => {},
  onPickupOptionSelected = () => {},
}) => {
  const deliveryAndPickupOptions = [...deliveryOptions, ...pickupOptions]
  console.log({deliveryAndPickupOptions, pickupOptions, onPickupOptionSelected})

  const handleDeliveryOptionSelect = (deliveryOption: DeliveryOption | PickupOption) => {
    if(deliveryOption.channel === 'pickup-in-point'){
      onPickupOptionSelected(deliveryOption.id)
    }else {
      onDeliveryOptionSelected(deliveryOption.id!)
    }
  }

  const handleDeliveryOptionDeselect = (deliveryOption: DeliveryOption) => {
    onDeliveryOptionDeselected(deliveryOption.id!)
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

  const selectedDeliveryOptions = useMemo(() => {
    return deliveryAndPickupOptions.filter(({ isSelected }) => isSelected)
  }, [deliveryAndPickupOptions])

  const [showSelectedDeliveryOption, setShowSelectedDeliveryOption] = useState(
    !!selectedDeliveryOptions.length 
  )

  return deliveryAndPickupOptions.length > 0 ? (
    showSelectedDeliveryOption ? (
      <>
        <p className="mt0 mb5 fw4 f4 lh-copy">
          <FormattedMessage id="store/checkout.shipping.selectedDeliveryOptionsLabel" />
        </p>

        <ListGroup borderPosition="none">
          {selectedDeliveryOptions.map((deliveryOption) => (
            <ShippingOption
              key={deliveryOption.id}
              deliveryOption={deliveryOption}
              fastestOption={fastestOption}
              cheapestOption={cheapestOption}
              onDeselectDeliveryOption={() =>
                setShowSelectedDeliveryOption(false)
              }
              isSelected
            />
          ))}
        </ListGroup>
      </>
    ) : (
      <ListGroup>
        {deliveryAndPickupOptions.map((shippingOption) => (
          <ShippingOption
            key={shippingOption.id}
            deliveryOption={shippingOption}
            fastestOption={fastestOption}
            cheapestOption={cheapestOption}
            onSelectDeliveryOption={() => {
              handleDeliveryOptionSelect(shippingOption)
              setShowSelectedDeliveryOption(true)
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
