import React, { useState } from 'react'
import classnames from 'classnames'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { GroupOption } from 'vtex.checkout-components'
import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'
import { IconDelete, ButtonPlain, Divider } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import PickupDetailsModal from './components/PickupDetailsModal'
import { getName, isPickupOption, slugify } from './utils/sla'

interface EstimateDeliveryOption {
  shippingEstimate: string
  price: number
}

export const ShippingOptionPreview: React.VFC = () => {
  return (
    <>
      <button
        className="w-100 tl pointer db lh-copy bg-base ph5 pv5-ns flex items-center justify-between bn pv4"
        role="option"
        aria-selected="false"
        disabled
      >
        <div className="flex w-100">
          <div className="flex flex-column w-100">
            <span className="br1 mw4 w-100 pt2 pb3 mv2 bg-muted-5" />
            <span className="br1 dib mt4 mw5 w-100 pt2 pb3 mv2 bg-muted-5" />
          </div>
          <div className="mw3 w-100">
            <span className="br1 dib w-100 pt2 pb3 mv2 bg-muted-5" />
          </div>
        </div>
      </button>
      <div className="w-100 pr5 pr0-ns pl5">
        <Divider />
      </div>
    </>
  )
}

interface Props {
  onSelectShippingOption?: () => void
  onDeselectShippingOption?: () => void
  shippingOption: DeliveryOption | PickupOption
  isSelected?: boolean
  fastestOption?: EstimateDeliveryOption
  cheapestOption?: EstimateDeliveryOption
}

const ShippingOption: React.VFC<Props> = ({
  onSelectShippingOption,
  onDeselectShippingOption,
  shippingOption,
  fastestOption,
  cheapestOption,
  isSelected = false,
}) => {
  const [showPickupModal, setShowPickupModal] = useState(false)

  const content = (
    <div className="flex w-100" id={slugify(shippingOption.id)}>
      <div className="flex flex-column w-100">
        <span className="c-on-base fw5">{getName(shippingOption)}</span>
        <span
          className={classnames('dib mt2 fw5', {
            'c-muted-1':
              shippingOption.estimate !== fastestOption?.shippingEstimate,
            'c-success':
              shippingOption.estimate === fastestOption?.shippingEstimate,
          })}
        >
          <TranslateEstimate shippingEstimate={shippingOption.estimate ?? ''} />
        </span>
        {isPickupOption(shippingOption) && (
          <span className="fw4 f6 c-muted-1">
            <FormattedMessage
              id="store/checkout.shipping.distance"
              values={{
                distanceValue: shippingOption.storeDistance?.toFixed(1),
              }}
            />
          </span>
        )}
      </div>
      <div
        className={classnames('fw4', {
          'c-success fw5': shippingOption.price === cheapestOption?.price,
        })}
      >
        <FormattedPrice value={(shippingOption.price ?? 0) / 100} />
      </div>
    </div>
  )

  return isSelected ? (
    <div className="bg-muted-5 pa5 flex-column items-start lh-copy">
      <div className="flex">
        {content}
        <button
          className="flex-shrink-0 c-muted-1 ml5 pa2 flex bg-transparent bn pointer"
          onClick={onDeselectShippingOption}
          role="option"
          aria-selected
        >
          <IconDelete />
        </button>
      </div>

      {isPickupOption(shippingOption) && (
        <div className="flex flex-column items-start">
          <ButtonPlain size="small" onClick={() => setShowPickupModal(true)}>
            <FormattedMessage id="store/checkout.shipping.seeDetails" />
          </ButtonPlain>

          <PickupDetailsModal
            pickupOption={shippingOption}
            showPickupModal={showPickupModal}
            setShowPickupModal={setShowPickupModal}
          />
        </div>
      )}
    </div>
  ) : (
    <GroupOption
      onClick={onSelectShippingOption}
      selected={shippingOption.isSelected}
    >
      {content}
    </GroupOption>
  )
}

export default ShippingOption
