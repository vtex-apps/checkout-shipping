import React from 'react'
import { AddressContext } from 'vtex.address-context'
import { OrderShipping } from 'vtex.order-shipping'
import type { Address } from 'vtex.checkout-graphql'
import { Loading } from 'vtex.render-runtime'

import useAddressStateMachine from './machines/useAddressStateMachine'
import AddressCompletionForm from './components/AddressCompletionForm'
import useAddressRules from './useAddressRules'

const { useOrderShipping } = OrderShipping

const ShippingAddress: React.VFC = () => {
  const { matches, send, state } = useAddressStateMachine()

  const handleAddressCompleted = (updatedAddress: Address) => {
    send({
      type: 'SUBMIT_EDIT_ADDRESS',
      updatedAddress: {
        ...updatedAddress,
        addressType: updatedAddress.addressType ?? 'residential',
      },
    })
  }

  switch (true) {
    case state.matches('editAddress'): {
      return (
        <AddressCompletionForm
          onAddressCompleted={handleAddressCompleted}
          onAddressReset={() => send('RESET_ADDRESS')}
          isSubmitting={matches({ editAddress: 'submitting' })}
        />
      )
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
