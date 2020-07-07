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

const { useOrderForm } = OrderForm
const { useAddressContext } = AddressContext

interface Props {
  selectedAddress: Address
  deliveryOptions: DeliveryOption[]
  isSubmitting: boolean
  onShippingOptionEdit?: () => void
  onAddressCompleted?: (
    updatedAddress: Address,
    buyerIsReceiver: boolean
  ) => void
  onAddressReset: () => void
  onEditReceiverInfo: () => void
}

const AddressCompletionForm: React.FC<Props> = ({
  selectedAddress,
  deliveryOptions,
  isSubmitting,
  onAddressReset = () => {},
  onShippingOptionEdit,
  onAddressCompleted = () => {},
  onEditReceiverInfo = () => {},
}) => {
  const {
    orderForm: { clientProfileData },
  } = useOrderForm()

  const [buyerIsReceiver, setBuyerIsReceiver] = useState(true)
  const { address, invalidFields } = useAddressContext()

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

    const validAddress =
      invalidFields.filter(field => field !== 'receiverName').length === 0

    if (validAddress) {
      onAddressCompleted(updatedAddress, buyerIsReceiver)
    }
  }

  return (
    <div className="lh-copy">
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

        <div className="mb5">
          <AddressForm
            hiddenFields={['receiverName']}
            onResetAddress={onAddressReset}
          />
        </div>

        {selectedAddress.receiverName == null && (
          <div className="mb7">
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
