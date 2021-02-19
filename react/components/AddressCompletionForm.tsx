import React, { useState, useMemo } from 'react'
import { AddressForm, useAddressForm } from 'vtex.place-components'
import type { Address } from 'vtex.checkout-graphql'
import { Button, Input, ButtonPlain } from 'vtex.styleguide'
import { OrderForm } from 'vtex.order-manager'
import { AddressContext } from 'vtex.address-context'
import { FormattedMessage, useIntl } from 'react-intl'

const { useOrderForm } = OrderForm
const { useAddressContext } = AddressContext

interface Props {
  isSubmitting: boolean
  onAddressCompleted?: (updatedAddress: Address) => void
  onAddressReset: () => void
}

const AddressCompletionForm: React.FC<Props> = ({
  isSubmitting,
  onAddressReset = () => {},
  onAddressCompleted = () => {},
}) => {
  const intl = useIntl()
  const {
    orderForm: { clientProfileData, canEditData },
  } = useOrderForm()

  const { address: initialAddress } = useAddressContext()
  const form = useAddressForm({ initialAddress })

  const mandatoryEditableFields = form.invalidFields

  const { firstName, lastName } = clientProfileData ?? {
    firstName: '',
    lastName: '',
  }

  const autoReceiverName = useMemo(() => `${firstName} ${lastName}`, [
    firstName,
    lastName,
  ])

  const [editingReceiverName, setEditingReceiverName] = useState(
    !form.address.receiverName && !canEditData
  )

  const handleEditReceiverName = () => {
    setEditingReceiverName(true)
  }

  const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = (
    evt
  ) => {
    form.onFieldChange('receiverName', evt.target.value)
  }

  const handleFormSubmit: React.FormEventHandler = (evt) => {
    evt.preventDefault()

    const updatedAddress = { ...form.address }

    const onlyReceiverInvalid =
      form.invalidFields.length > 0 &&
      form.invalidFields.every((field) => field === 'receiverName')

    if (!editingReceiverName && onlyReceiverInvalid) {
      updatedAddress.receiverName = autoReceiverName
      onAddressCompleted(updatedAddress)
    } else if (form.isValid) {
      onAddressCompleted(updatedAddress)
    } else {
      form.invalidFields.forEach((field: string) => {
        form.onFieldBlur(field)
      })
    }
  }

  return (
    <div className="lh-copy">
      <form onSubmit={handleFormSubmit}>
        <span className="dib mb4 t-body fw6">
          <FormattedMessage id="store/checkout.shipping.completeAddressLabel" />
        </span>

        <AddressForm
          hiddenFields={['receiverName']}
          onResetAddress={onAddressReset}
          mandatoryEditableFields={mandatoryEditableFields}
          form={form}
        />

        <div className="mt6 mb6">
          <p className="fw5 mb5 mt0">
            <FormattedMessage id="store/checkout.shipping.receiverLabel" />
          </p>

          {!editingReceiverName ? (
            <div className="flex items-center">
              <span className="mr3">
                {form.address.receiverName ?? autoReceiverName}
              </span>
              <ButtonPlain onClick={handleEditReceiverName}>
                <FormattedMessage id="store/checkout.shipping.changeReceiverLabel" />
              </ButtonPlain>
            </div>
          ) : (
            <Input
              label={intl.formatMessage({
                id: 'store/checkout.shipping.receiverNameLabel',
              })}
              onChange={handleNameChange}
              onBlur={() => {
                form.onFieldBlur('receiverName')
              }}
              value={form.address.receiverName}
              errorMessage={
                form.meta.receiverName?.blurred &&
                form.meta.receiverName?.errorMessage
                  ? intl.formatMessage(form.meta.receiverName.errorMessage)
                  : ''
              }
            />
          )}
        </div>

        <Button
          testId="continue-address-button"
          block
          size="large"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          <span className="f5">
            <FormattedMessage id="store/checkout.shipping.goToPayment" />
          </span>
        </Button>
      </form>
    </div>
  )
}

export default AddressCompletionForm
