import { Address } from 'vtex.checkout-graphql'
import React, { useCallback } from 'react'
import { OrderForm } from 'vtex.order-manager'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'

import NewAddressForm from './components/NewAddressForm'
import AddressList from './components/AddressList'
import ShippingOptionList from './components/ShippingOptionList'
import AddressCompletionForm from './components/AddressCompletionForm'
import ReceiverInfoForm from './components/ReceiverInfoForm'
import useShippingStateMachine from './shippingStateMachine/useShippingStateMachine'
import { useAddressRules } from './hooks/useAddressRules'

const { useOrderForm } = OrderForm
const { useOrderShipping } = OrderShipping
const { useAddressContext } = AddressContext

const ShippingForm: React.FC = () => {
  const {
    orderForm: {
      canEditData,
      shipping: { availableAddresses },
      userProfileId,
    },
  } = useOrderForm()
  const { selectedAddress, deliveryOptions } = useOrderShipping()
  const { isValid } = useAddressContext()

  const { matches, send, state } = useShippingStateMachine({
    availableAddresses: (availableAddresses as Address[]) ?? [],
    canEditData,
    deliveryOptions,
    selectedAddress: selectedAddress ?? null,
    userProfileId,
    isAddressValid: isValid,
  })

  const handleAddressCreated = useCallback(
    (address: Address) => {
      send({
        type: 'SUBMIT_CREATE_ADDRESS',
        address: {
          ...address,
          addressType: address.addressType ?? 'residential',
          addressId: '12345'
        },
      })
    },
    [send]
  )

  const handleDeliveryOptionSelect = (deliveryOptionId: string) => {
    send({ type: 'SUBMIT_SELECT_DELIVERY_OPTION', deliveryOptionId })
  }

  const handleAddressCompleted = (
    updatedAddress: Address,
    buyerIsReceiver: boolean
  ) => {
    send({
      type: 'SUBMIT_COMPLETE_ADDRESS',
      buyerIsReceiver,
      updatedAddress: {
        ...updatedAddress,
        addressType: updatedAddress.addressType ?? 'residential',
      },
    })
  }

  switch (true) {
    case matches('completeAddress'): {
      return (
        <AddressCompletionForm
          selectedAddress={selectedAddress!}
          deliveryOptions={state.context.deliveryOptions}
          onShippingOptionEdit={() => send('GO_TO_SELECT_DELIVERY_OPTION')}
          onAddressCompleted={handleAddressCompleted}
          onAddressReset={() => send('RESET_ADDRESS')}
          onEditReceiverInfo={() => send('EDIT_RECEIVER_INFO')}
          isSubmitting={matches({ completeAddress: 'submitting' })}
        />
      )
    }

    case matches('editReceiverInfo'): {
      return (
        state.context.selectedAddress && (
          <ReceiverInfoForm
            deliveryOptions={state.context.deliveryOptions}
            isSubmitting={matches({ editReceiverInfo: 'submitting' })}
            selectedAddress={state.context.selectedAddress}
            onEditAddress={() => send('EDIT_ADDRESS')}
            onReceiverInfoSave={(receiverName) => {
              send({ type: 'SUBMIT_RECEIVER_INFO', receiverName })
            }}
            onShippingOptionEdit={() => send('GO_TO_SELECT_DELIVERY_OPTION')}
          />
        )
      )
    }

    case matches('selectDeliveryOption'): {
      return (
        <ShippingOptionList
          deliveryOptions={state.context.deliveryOptions}
          onEditAddress={() => send('EDIT_ADDRESS')}
          onEditReceiverInfo={() => send('EDIT_RECEIVER_INFO')}
          onDeliveryOptionSelected={handleDeliveryOptionSelect}
          selectedAddress={state.context.selectedAddress!}
        />
      )
    }

    case matches('selectAddress'): {
      return (
        <AddressList
          addresses={state.context.availableAddresses}
          selectedAddress={state.context.selectedAddress}
          onCreateAddress={() => send('GO_TO_CREATE_ADDRESS')}
          onAddressSelected={(address) =>
            send({ type: 'SUBMIT_SELECT_ADDRESS', address })
          }
        />
      )
    }

    case matches('createAddress'):

    // eslint-disable-next-line no-fallthrough
    default: {
      return <NewAddressForm onAddressCreated={handleAddressCreated} />
    }
  }
}

const ShippingFormWithAddress: React.FC = () => {
  const { selectedAddress, countries } = useOrderShipping()

  const addressRules = useAddressRules()

  return (
    <AddressContext.AddressContextProvider
      address={selectedAddress!}
      countries={countries}
      rules={addressRules}
    >
      <ShippingForm />
    </AddressContext.AddressContextProvider>
  )
}

export default ShippingFormWithAddress
