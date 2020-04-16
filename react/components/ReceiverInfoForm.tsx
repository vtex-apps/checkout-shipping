import React, { useState } from 'react'
import { Address } from 'vtex.checkout-graphql'
import { Button, Input } from 'vtex.styleguide'
import { FormattedMessage, useIntl } from 'react-intl'

interface Props {
  isSubmitting: boolean
  onReceiverInfoSave: (receiverName: string) => void
  selectedAddress: Address
}

const ReceiverInfoForm: React.FC<Props> = ({
  isSubmitting,
  onReceiverInfoSave,
  selectedAddress,
}) => {
  const intl = useIntl()

  const [name, setName] = useState(selectedAddress.receiverName)

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setName(evt.target.value)
  }

  const handleSubmit: React.FormEventHandler = async evt => {
    evt.preventDefault()
    if (name) {
      onReceiverInfoSave(name)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <span className="fw6 dib mb6">
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
  )
}

export default ReceiverInfoForm
