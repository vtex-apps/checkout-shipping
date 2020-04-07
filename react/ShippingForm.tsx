import { Address } from 'vtex.checkout-graphql'
import React, { useState, useCallback } from 'react'
import { OrderForm } from 'vtex.order-manager'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'

import NewAddressForm from './components/NewAddressForm'
import AddressList from './components/AddressList'
import ShippingOptionList from './components/ShippingOptionList'
import AddressCompletionForm from './components/AddressCompletionForm'
import ReceiverInfoForm from './components/ReceiverInfoForm'

enum ShippingStage {
  CREATE_ADDRESS,
  SELECT_ADDRESS,
  SELECT_DELIVERY_OPTION,
  COMPLETE_ADDRESS,
  EDIT_RECEIVER_INFO,
}

const ShippingForm: React.FC = () => {
  const {
    orderForm: {
      shipping: { availableAddresses },
    },
  } = OrderForm.useOrderForm()
  const { selectedAddress, deliveryOptions } = OrderShipping.useOrderShipping()

  const selectedDeliveryOptions = deliveryOptions.filter(
    ({ isSelected }) => isSelected
  )

  const [currentStage, setCurrentStage] = useState<ShippingStage>(() => {
    if (selectedAddress != null) {
      return ShippingStage.SELECT_DELIVERY_OPTION
    }
    if (availableAddresses?.length !== 0) {
      return ShippingStage.SELECT_ADDRESS
    }
    return ShippingStage.CREATE_ADDRESS
  })

  const handleAddressCreated = useCallback(() => {
    setCurrentStage(ShippingStage.SELECT_DELIVERY_OPTION)
  }, [])

  const handleDeliveryOptionSelect = () => {
    if (selectedAddress.addressType == null) {
      setCurrentStage(ShippingStage.COMPLETE_ADDRESS)
    }
  }

  const handleAddressCompleted = ({
    buyerIsReceiver,
  }: {
    buyerIsReceiver: boolean
  }) => {
    if (!buyerIsReceiver) {
      setCurrentStage(ShippingStage.EDIT_RECEIVER_INFO)
    } else {
      // go to next step
    }
  }

  switch (currentStage) {
    case ShippingStage.COMPLETE_ADDRESS: {
      return (
        <AddressCompletionForm
          address={selectedAddress}
          onShippingOptionEdit={() =>
            setCurrentStage(ShippingStage.SELECT_DELIVERY_OPTION)
          }
          onAddressCompleted={handleAddressCompleted}
        />
      )
    }
    case ShippingStage.EDIT_RECEIVER_INFO: {
      return (
        <ReceiverInfoForm
          onReceiverInfoSave={() =>
            setCurrentStage(ShippingStage.SELECT_DELIVERY_OPTION)
          }
        />
      )
    }
    case ShippingStage.SELECT_DELIVERY_OPTION: {
      return (
        <ShippingOptionList
          deliveryOptions={deliveryOptions}
          onEditAddress={() => setCurrentStage(ShippingStage.SELECT_ADDRESS)}
          onEditReceiverInfo={() =>
            setCurrentStage(ShippingStage.EDIT_RECEIVER_INFO)
          }
          onDeliveryOptionSelected={handleDeliveryOptionSelect}
        />
      )
    }
    case ShippingStage.SELECT_ADDRESS: {
      return (
        <AddressList
          addresses={availableAddresses as Address[]}
          onCreateAddress={() => setCurrentStage(ShippingStage.CREATE_ADDRESS)}
          onAddressSelected={() =>
            setCurrentStage(ShippingStage.SELECT_DELIVERY_OPTION)
          }
        />
      )
    }
    case ShippingStage.CREATE_ADDRESS:
    default: {
      return <NewAddressForm onAddressCreated={handleAddressCreated} />
    }
  }
}

const ShippingFormWithAddress: React.FC = () => {
  const { selectedAddress, countries } = OrderShipping.useOrderShipping()

  return (
    <AddressContext.AddressContextProvider
      address={selectedAddress}
      countries={countries}
    >
      <ShippingForm />
    </AddressContext.AddressContextProvider>
  )
}

export default ShippingFormWithAddress
