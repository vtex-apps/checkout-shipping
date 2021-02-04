import React from 'react'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'
import { OrderForm } from 'vtex.order-manager'
import { Address } from 'vtex.checkout-graphql'
import { Loading } from 'vtex.render-runtime'

import useAddressStateMachine from './machines/useAddressStateMachine'
import AddressCompletionForm from './components/AddressCompletionForm'
import ReceiverInfoForm from './components/ReceiverInfoForm'
import useAddressRules from './useAddressRules'

const { useOrderShipping } = OrderShipping
const { useOrderForm } = OrderForm

const ShippingAddress: React.VFC = () => {
  const {
    orderForm: { canEditData },
  } = useOrderForm()

  const { selectedAddress } = useOrderShipping()

  const { matches, send, state } = useAddressStateMachine({
    selectedAddress: selectedAddress ?? null,
    canEditData,
  })

  const handleAddressCompleted = (
    updatedAddress: Address,
    buyerIsReceiver: boolean
  ) => {
    send({
      type: 'SUBMIT_EDIT_ADDRESS',
      buyerIsReceiver,
      updatedAddress: {
        ...updatedAddress,
        addressType: updatedAddress.addressType ?? 'residential',
      },
    })
  }

  switch (true) {
    case matches('editAddress'): {
      return (
        <AddressCompletionForm
          selectedAddress={selectedAddress}
          onAddressCompleted={handleAddressCompleted}
          onAddressReset={() => send('RESET_ADDRESS')}
          onEditReceiverInfo={() => send('EDIT_RECEIVER_INFO')}
          isSubmitting={matches({ editAddress: 'submitting' })}
        />
      )
    }

    case matches('editReceiverInfo'): {
      return state.context.selectedAddress ? (
        <ReceiverInfoForm
          isSubmitting={matches({ editReceiverInfo: 'submitting' })}
          selectedAddress={state.context.selectedAddress}
          onEditAddress={() => send('EDIT_ADDRESS')}
          onReceiverInfoSave={(receiverName) => {
            send({ type: 'SUBMIT_RECEIVER_INFO', receiverName })
          }}
        />
      ) : null
    }

    default: {
      return null
    }
  }
}

const ShippingAddressWithAddress: React.VFC = () => {
  const { selectedAddress, countries } = useOrderShipping()

  const addressRules = useAddressRules()

  if (addressRules == null) {
    return <Loading />
  }

  return (
    <AddressContext.AddressContextProvider
      address={selectedAddress!}
      countries={countries}
      rules={addressRules}
    >
      <ShippingAddress />
    </AddressContext.AddressContextProvider>
  )
}

export default ShippingAddressWithAddress
