import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Address } from 'vtex.checkout-graphql'
import { Button, ButtonPlain, IconEdit, Input } from 'vtex.styleguide'
import { PlaceDetails } from 'vtex.place-components'

interface Props {
  isSubmitting: boolean
  onEditAddress: () => void
  onReceiverInfoSave: (receiverName: string) => void
  selectedAddress: Address
}

const ReceiverInfoForm: React.FC<Props> = ({
  isSubmitting,
  onEditAddress,
  onReceiverInfoSave,
  selectedAddress,
}) => {
  const intl = useIntl()

  const [name, setName] = useState(selectedAddress.receiverName ?? '')

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
          testId="continue-address-button"
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          size="large"
          block
        >
          <span className="f5">
            <FormattedMessage id="store/checkout.shipping.goToPayment" />
          </span>
        </Button>
      </form>
    </div>
  )
}

export default ReceiverInfoForm
