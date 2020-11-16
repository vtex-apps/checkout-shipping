import React, { useMemo, useState } from 'react'
import { DeliveryOption } from 'vtex.checkout-graphql'
import { Alert } from 'vtex.styleguide'
import { ListGroup } from 'vtex.checkout-components'
import { getFastestSla, getCheapestSla } from '@vtex/estimate-calculator'
import { FormattedMessage } from 'react-intl'

import ShippingOption from './ShippingOption'

interface Props {
  deliveryOptions: DeliveryOption[]
  onDeliveryOptionSelected?: (id: string) => void
  onDeliveryOptionDeselected?: (id: string) => void
}

const ShippingOptionList: React.FC<Props> = ({
  deliveryOptions,
  onDeliveryOptionSelected = () => {},
  onDeliveryOptionDeselected = () => {},
}) => {
  const handleDeliveryOptionSelect = (deliveryOption: DeliveryOption) => {
    onDeliveryOptionSelected(deliveryOption.id!)
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
    return deliveryOptions.filter(({ isSelected }) => isSelected)
  }, [deliveryOptions])

  const [showSelectedDeliveryOption, setShowSelectedDeliveryOption] = useState(
    true
  )

  return deliveryOptions.length > 0 ? (
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
        {deliveryOptions.map((deliveryOption) => (
          <ShippingOption
            key={deliveryOption.id}
            deliveryOption={deliveryOption}
            fastestOption={fastestOption}
            cheapestOption={cheapestOption}
            onSelectDeliveryOption={() => {
              handleDeliveryOptionSelect(deliveryOption)
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
