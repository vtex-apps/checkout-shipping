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
import { OrderShipping } from 'vtex.order-shipping'
import { FormattedCurrency } from 'vtex.format-currency'
import { TranslateEstimate } from 'vtex.shipping-estimate-translator'
import { OrderForm } from 'vtex.order-manager'
import { AddressContext } from 'vtex.address-context'

interface Props {
  address: Address
  onShippingOptionEdit?: () => void
  onAddressCompleted?: (result: { buyerIsReceiver: boolean }) => void
}

const AddressCompletionForm: React.FC<Props> = ({
  onShippingOptionEdit,
  onAddressCompleted = () => {},
}) => {
  const {
    orderForm: { clientProfileData },
  } = OrderForm.useOrderForm()
  const {
    deliveryOptions,
    updateSelectedAddress,
  } = OrderShipping.useOrderShipping()
  const [buyerIsReceiver, setBuyerIsReceiver] = useState(true)
  const { address } = AddressContext.useAddressContext()
  const [submitLoading, setSubmitLoading] = useState(false)

  const { firstName, lastName } = clientProfileData!

  const selectedDeliveryOption: DeliveryOption = deliveryOptions.find(
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

    setSubmitLoading(true)

    await updateSelectedAddress(updatedAddress)

    setSubmitLoading(false)

    onAddressCompleted({ buyerIsReceiver })
  }

  return (
    <div className="lh-copy">
      <div className="c-muted-1">
        <span className="fw6 flex items-center">
          Shipping option{' '}
          <div className="dib ml4">
            <ButtonPlain onClick={onShippingOptionEdit}>
              <IconEdit solid />
            </ButtonPlain>
          </div>
        </span>

        <div className="mt2 flex flex-column c-muted-1">
          <span>
            {selectedDeliveryOption.id} &ndash;{' '}
            <FormattedCurrency
              value={(selectedDeliveryOption.price ?? 0) / 100}
            />
          </span>
          <span>
            <TranslateEstimate
              shippingEstimate={selectedDeliveryOption.estimate ?? ''}
            />
          </span>
        </div>
      </div>

      <div className="mt6 mb5">
        <Divider />
      </div>

      <form onSubmit={handleFormSubmit}>
        <span className="dib mb4 t-body fw6">
          Complete the delivery address
        </span>

        <AddressForm hiddenFields={['receiverName']} />

        {address.receiverName == null && (
          <div className="mt5 mb7">
            <Checkbox
              label={
                <Fragment>
                  <span className="fw6">{firstName}</span> will receive the
                  order.
                </Fragment>
              }
              checked={buyerIsReceiver}
              onChange={handleBuyerIsReceiverChange}
            />
          </div>
        )}

        <Button
          block
          size="large"
          type="submit"
          disabled={submitLoading}
          isLoading={submitLoading}
        >
          <span className="f5">Continue</span>
        </Button>
      </form>
    </div>
  )
}

export default AddressCompletionForm
