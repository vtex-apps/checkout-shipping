import React, { useState } from 'react'
import { AddressForm } from 'vtex.place-components'
import { Address, DeliveryOption, PickupOption } from 'vtex.checkout-graphql'
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
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext, Utils } from 'vtex.address-context'
import { FormattedMessage } from 'react-intl'

const { useOrderForm } = OrderForm
const { useOrderShipping } = OrderShipping
const { useAddressContext } = AddressContext
const { validateAddress } = Utils

interface Props {
  selectedAddress: Address
  deliveryOptions: DeliveryOption[]
  pickupOptions: PickupOption[]
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
  pickupOptions,
  isSubmitting,
  onAddressReset = () => {},
  onShippingOptionEdit,
  onAddressCompleted = () => {},
  onEditReceiverInfo = () => {},
}) => {
  const {
    orderForm: { clientProfileData, canEditData },
  } = useOrderForm()

  const { searchedAddress } = useOrderShipping()

  const { address, invalidFields, rules } = useAddressContext()
  const [buyerIsReceiver, setBuyerIsReceiver] = useState(
    !address.isDisposable || canEditData
  )

  const { invalidFields: mandatoryEditableFields } = validateAddress(
    searchedAddress,
    rules
  )

  const { firstName, lastName } = clientProfileData!

  const shippingOptions = [...deliveryOptions, ...pickupOptions.slice(0, 1)]

  const selectedShippingOption = shippingOptions.find(
    ({ isSelected }) => isSelected
  )

  const handleBuyerIsReceiverChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    setBuyerIsReceiver(evt.target.checked)
  }

  const handleFormSubmit: React.FormEventHandler = async (evt) => {
    evt.preventDefault()

    const updatedAddress = { ...address }

    if (buyerIsReceiver) {
      updatedAddress.receiverName = `${firstName} ${lastName}`
    }

    const validAddress =
      invalidFields.filter((field) => field !== 'receiverName').length === 0

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
            {selectedShippingOption?.id} &ndash;{' '}
            <FormattedCurrency
              value={(selectedShippingOption?.price ?? 0) / 100}
            />
          </span>
          <span>
            <TranslateEstimate
              shippingEstimate={selectedShippingOption?.estimate ?? ''}
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
            mandatoryEditableFields={mandatoryEditableFields}
          />
        </div>

        {selectedAddress.receiverName == null && canEditData && (
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
