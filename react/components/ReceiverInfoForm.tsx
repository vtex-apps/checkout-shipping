import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Address, DeliveryOption } from 'vtex.checkout-graphql'
import { Button, ButtonPlain, Divider, IconEdit, Input } from 'vtex.styleguide'
import { PlaceDetails } from 'vtex.place-components'
import { FormattedCurrency } from 'vtex.format-currency'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'

interface Props {
  isSubmitting: boolean
  deliveryOptions: DeliveryOption[]
  onEditAddress: () => void
  onReceiverInfoSave: (receiverName: string) => void
  onShippingOptionEdit: () => void
  selectedAddress: Address
}

const ReceiverInfoForm: React.FC<Props> = ({
  deliveryOptions,
  isSubmitting,
  onEditAddress,
  onReceiverInfoSave,
  onShippingOptionEdit,
  selectedAddress,
}) => {
  const intl = useIntl()

  const [name, setName] = useState(selectedAddress.receiverName ?? '')

  const selectedDeliveryOption = deliveryOptions.find(
    ({ isSelected }) => isSelected
  )

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    setName(evt.target.value)
  }

  const handleSubmit: React.FormEventHandler = async (evt) => {
    evt.preventDefault()
    if (name) {
      onReceiverInfoSave(name)
    }
  }

  return (
    <div className="lh-copy">
      <div className="c-muted-1">
        <span className="fw6 flex items-center">
          <FormattedMessage id="store/checkout.shipping.shippingOptionLabel" />{' '}
          <div className="dib ml4">
            <ButtonPlain onClick={onShippingOptionEdit}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>

        <div className="mt2 flex flex-column c-muted-1">
          <span>
            {selectedDeliveryOption?.id} &ndash;{' '}
            <FormattedCurrency
              value={(selectedDeliveryOption?.price ?? 0) / 100}
            />
          </span>
          <span>
            <TranslateEstimate
              shippingEstimate={selectedDeliveryOption?.estimate ?? ''}
            />
          </span>
        </div>
      </div>

      <div className="mt6 mb5">
        <Divider />
      </div>

      <form onSubmit={handleSubmit}>
        <span className="dib mb4 t-body fw6">
          <FormattedMessage id="store/checkout.shipping.completeAddressLabel" />{' '}
          <div className="dib ml4">
            <ButtonPlain onClick={onEditAddress}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>

        <PlaceDetails display="extended" hiddenFields={['receiverName']} />

        <span className="fw6 dib mt7 mb6">
          <FormattedMessage id="store/checkout.shipping.receiverDescription" />
        </span>

        <div className="mb7">
          <Input
            label={intl.formatMessage({
              id: 'store/checkout.shipping.receiverNameLabel',
            })}
            onChange={handleNameChange}
            value={name}
          />
        </div>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          size="large"
          block
        >
          <span className="f5">
            <FormattedMessage id="store/checkout.shipping.continue" />
          </span>
        </Button>
      </form>
    </div>
  )
}

export default ReceiverInfoForm
