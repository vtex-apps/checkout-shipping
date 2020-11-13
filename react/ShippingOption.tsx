import React, { useState } from 'react'
import classnames from 'classnames'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { GroupOption } from 'vtex.checkout-components'
import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'
import { IconDelete, ButtonPlain, Modal, Divider } from 'vtex.styleguide'

import PickupDetailsModal from './components/PickupDetailsModal'

interface EstimateDeliveryOption {
  shippingEstimate: string
  price: number
}

interface Props {
  onSelectDeliveryOption?: () => void
  onDeselectDeliveryOption?: () => void
  deliveryOption: any
  isSelected?: boolean
  fastestOption?: EstimateDeliveryOption
  cheapestOption?: EstimateDeliveryOption
}

const getName = (shippingOption: any) => {
  return shippingOption.channel === 'pickup-in-point'
    ? shippingOption.friendlyName
    : shippingOption.id
}

const ShippingOption: React.VFC<Props> = ({
  onSelectDeliveryOption,
  onDeselectDeliveryOption,
  deliveryOption,
  fastestOption,
  cheapestOption,
  isSelected = false,
}) => {
  const [showPickupModal, setShowPickupModal] = useState(false)

  const content = (
    <div className="flex w-100">
      <div className="flex flex-column w-100">
        <span className="c-on-base fw5">{getName(deliveryOption)}</span>
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
    <div className="bg-muted-5 pa5 flex-column items-start lh-copy">
      <div className="flex">
        {content}
        <button
          className="flex-shrink-0 c-muted-1 ml5 pa2 flex bg-transparent bn pointer"
          onClick={onDeselectDeliveryOption}
          role="option"
          aria-selected
        >
          <IconDelete />
        </button>
      </div>

      <div>
        <ButtonPlain size="small" onClick={() => setShowPickupModal(true)}>
          Ver Detalhes
        </ButtonPlain>

        <PickupDetailsModal
          pickupOption={deliveryOption}
          showPickupModal={showPickupModal}
          setShowPickupModal={setShowPickupModal}
        />
      </div>
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
