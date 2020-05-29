import React, { Fragment, useState } from 'react'
import { AddressForm } from 'vtex.place-components'
import { Address, DeliveryOption } from 'vtex.checkout-graphql'
import {
  Checkbox,
  Button,
  ButtonPlain,
  IconEdit,
  Divider,
} from 'vtex.styleguide'
import { FormattedCurrency } from 'vtex.format-currency'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { OrderForm } from 'vtex.order-manager'
import { AddressContext } from 'vtex.address-context'
import { FormattedMessage } from 'react-intl'

interface Props {
  address: Address
  deliveryOptions: DeliveryOption[]
  isSubmitting: boolean
  onShippingOptionEdit?: () => void
  onAddressCompleted?: (
    updatedAddress: Address,
    buyerIsReceiver: boolean
  ) => void
  onAddressReset: () => void
}

const AddressCompletionForm: React.FC<Props> = ({
  deliveryOptions,
  isSubmitting,
  onAddressReset = () => {},
  onShippingOptionEdit,
  onAddressCompleted = () => {},
}) => {
  const {
    orderForm: { clientProfileData },
  } = OrderForm.useOrderForm()

  const [buyerIsReceiver, setBuyerIsReceiver] = useState(true)
  const { address } = AddressContext.useAddressContext()

  const { firstName, lastName } = clientProfileData!

  const selectedDeliveryOption = deliveryOptions.find(
    ({ isSelected }) => isSelected
  )

  const handleBuyerIsReceiverChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    setBuyerIsReceiver(evt.target.checked)
  }

  const handleFormSubmit: React.FormEventHandler = async evt => {
    evt.preventDefault()

    const updatedAddress = address

    if (buyerIsReceiver) {
      updatedAddress.receiverName = `${firstName} ${lastName}`
    }

    onAddressCompleted(updatedAddress, buyerIsReceiver)
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

      <form onSubmit={handleFormSubmit}>
        <span className="dib mb4 t-body fw6">
          <FormattedMessage id="store/checkout.shipping.completeAddressLabel" />
        </span>

        <AddressForm
          hiddenFields={['receiverName']}
          onResetAddress={onAddressReset}
        />

        {address.receiverName == null && (
          <div className="mt5 mb7">
            <Checkbox
              label={
                <FormattedMessage
                  id="store/checkout.shipping.nameWillReceiveOrderLabel"
                  values={{ name: <span className="fw6">{firstName}</span> }}
                />
              }
              name="buyer-is-receiver"
              id="buyer-is-receiver-checkbox"
              checked={buyerIsReceiver}
              onChange={handleBuyerIsReceiverChange}
            />
          </div>
        )}

        <Button
          block
          size="large"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          <span className="f5">
            <FormattedMessage id="store/checkout.shipping.continue" />
          </span>
        </Button>
      </form>
    </div>
  )
}

export default AddressCompletionForm
