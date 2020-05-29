import classnames from 'classnames'
import React, { useMemo } from 'react'
import { Address, DeliveryOption } from 'vtex.checkout-graphql'
import { ButtonPlain, IconEdit } from 'vtex.styleguide'
import { PlaceDetails } from 'vtex.place-components'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { FormattedPrice } from 'vtex.formatted-price'
import { FormattedMessage } from 'react-intl'
import { ListGroup, GroupOption } from 'vtex.checkout-components'
import { getFastestSla } from '@vtex/estimate-calculator'

interface Props {
  deliveryOptions: DeliveryOption[]
  onEditAddress?: () => void
  onEditReceiverInfo?: () => void
  onDeliveryOptionSelected?: (id: string) => void
  selectedAddress: Address
}

const ShippingOptionList: React.FC<Props> = ({
  deliveryOptions,
  onEditAddress,
  onEditReceiverInfo,
  onDeliveryOptionSelected = () => {},
  selectedAddress,
}) => {
  const handleDeliveryOptionSelect = (deliveryOption: DeliveryOption) => {
    onDeliveryOptionSelected(deliveryOption.id!)
  }

  const fastestOption = useMemo(() => {
    return getFastestSla(
      deliveryOptions.map(({ id, estimate }) => ({
        id: id!,
        shippingEstimate: estimate!,
      }))
    )
  }, [deliveryOptions])

  return (
    <div>
      {selectedAddress.receiverName && (
        <div className="c-muted-1">
          <span className="fw6 flex items-center">
            <FormattedMessage id="store/checkout.shipping.receiverLabel" />{' '}
            <div className="dib ml4">
              <ButtonPlain onClick={onEditReceiverInfo}>
                <IconEdit solid />
              </ButtonPlain>
            </div>
          </span>

          <div className="mt2 mb6 lh-copy">{selectedAddress.receiverName}</div>
        </div>
      )}

      <span className="t-body fw6 flex items-center">
        <FormattedMessage id="store/checkout.shipping.shippingOptionsForAddressLabel" />{' '}
        <div className="dib ml4">
          <ButtonPlain onClick={onEditAddress}>
            <IconEdit solid />
          </ButtonPlain>
        </div>
      </span>

      <div className="mt2 mb6 lh-copy">
        <PlaceDetails display="compact" />
      </div>

      <ListGroup>
        {deliveryOptions.map(deliveryOption => (
          <GroupOption
            key={deliveryOption.id!}
            onClick={() => handleDeliveryOptionSelect(deliveryOption)}
          >
            <div className="flex w-100">
              <div className="flex flex-column w-100">
                <span className="c-on-base">{deliveryOption.id}</span>
                <span
                  className={classnames({
                    'c-muted-1': deliveryOption.id !== fastestOption?.id,
                    'c-success': deliveryOption.id === fastestOption?.id,
                  })}
                >
                  <TranslateEstimate
                    shippingEstimate={deliveryOption.estimate ?? ''}
                  />
                </span>
              </div>
              <FormattedPrice value={(deliveryOption.price ?? 0) / 100} />
            </div>
          </GroupOption>
        ))}
      </ListGroup>
    </div>
  )
}

export default ShippingOptionList
