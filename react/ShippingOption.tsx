import React from 'react'
import classnames from 'classnames'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { GroupOption } from 'vtex.checkout-components'
import { DeliveryOption } from 'vtex.checkout-graphql'
import { IconDelete } from 'vtex.styleguide'

interface EstimateDeliveryOption {
  shippingEstimate: string
  price: number
}

interface Props {
  onSelectDeliveryOption?: () => void
  onDeselectDeliveryOption?: () => void
  deliveryOption: DeliveryOption
  isSelected?: boolean
  fastestOption?: EstimateDeliveryOption
  cheapestOption?: EstimateDeliveryOption
}

const ShippingOption: React.VFC<Props> = ({
  onSelectDeliveryOption,
  onDeselectDeliveryOption,
  deliveryOption,
  fastestOption,
  cheapestOption,
  isSelected = false,
}) => {
  const content = (
    <div className="flex w-100">
      <div className="flex flex-column w-100">
        <span className="c-on-base fw5">{deliveryOption.id}</span>
        <span
          className={classnames('dib mt2 fw5', {
            'c-muted-1':
              deliveryOption.estimate !== fastestOption?.shippingEstimate,
            'c-success':
              deliveryOption.estimate === fastestOption?.shippingEstimate,
          })}
        >
          <TranslateEstimate shippingEstimate={deliveryOption.estimate ?? ''} />
        </span>
      </div>
      <div
        className={classnames('fw4', {
          'c-success fw5': deliveryOption.price === cheapestOption?.price,
        })}
      >
        <FormattedPrice value={(deliveryOption.price ?? 0) / 100} />
      </div>
    </div>
  )

  return isSelected ? (
    <div className="bg-muted-5 pa5 flex items-start lh-copy">
      {content}
      <button
        className="flex-shrink-0 c-muted-1 ml5 pa2 flex items-center bg-transparent bn pointer"
        onClick={onDeselectDeliveryOption}
        role="option"
        aria-selected
      >
        <IconDelete />
      </button>
    </div>
  ) : (
    <GroupOption
      onClick={onSelectDeliveryOption}
      selected={deliveryOption.isSelected}
    >
      {content}
    </GroupOption>
  )
}

export default ShippingOption
