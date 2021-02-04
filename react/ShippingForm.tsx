import { Address } from 'vtex.checkout-graphql'
import React, { useCallback } from 'react'
import { OrderForm } from 'vtex.order-manager'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'
import { Button } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import NewAddressForm from './NewAddressForm'
import AddressList from './components/AddressList'
import ShippingOptionList from './ShippingOptionList'
import useShippingStateMachine from './machines/useShippingStateMachine'
import useAddressRules from './useAddressRules'
import ShippingHeader from './ShippingHeader'

const { useOrderForm } = OrderForm
const { useOrderShipping } = OrderShipping

const ShippingForm: React.VFC = () => {
  const {
    orderForm: {
      canEditData,
      shipping: { availableAddresses },
      userProfileId,
    },
  } = useOrderForm()

  const { selectedAddress, deliveryOptions, pickupOptions } = useOrderShipping()

  const { matches, send, state } = useShippingStateMachine({
    availableAddresses: (availableAddresses as Address[]) ?? [],
    canEditData,
    selectedAddress: selectedAddress ?? null,
    userProfileId,
    retryAddress: null,
  })

  const handleAddressCreated = useCallback(
    (address: Address) => {
      send({
        type: 'SUBMIT_CREATE_ADDRESS',
        address: {
          ...address,
          addressType: address.addressType ?? 'residential',
        },
      })
    },
    [send]
  )

  const handleDeliveryOptionSelect = (deliveryOptionId: string) => {
    send({
      type: 'SUBMIT_SELECT_SHIPPING_OPTION',
      shippingOptionId: deliveryOptionId,
      deliveryChannel: 'delivery',
    })
  }

  const handlePickupOptionSelect = (pickupOptionId: string) => {
    send({
      type: 'SUBMIT_SELECT_SHIPPING_OPTION',
      shippingOptionId: pickupOptionId,
      deliveryChannel: 'pickup-in-point',
    })
  }

  switch (true) {
    case matches('selectShippingOption'): {
      return (
        <>
          <ShippingHeader onEditAddress={() => send('EDIT_ADDRESS')} />

          <ShippingOptionList
            deliveryOptions={deliveryOptions}
            pickupOptions={pickupOptions}
            onDeliveryOptionSelected={handleDeliveryOptionSelect}
            onPickupOptionSelected={handlePickupOptionSelect}
            onDeliveryOptionDeselected={() => send('DESELECT_SHIPPING_OPTION')}
            onPickupOptionDeselected={() => send('DESELECT_SHIPPING_OPTION')}
            showOnlySelectedShippingOption={matches({
              selectShippingOption: 'idle',
            })}
          />

          {matches({ selectShippingOption: 'idle' }) &&
            state.context.hasHistory && (
              <div className="mt6">
                <Button
                  block
                  size="large"
                  onClick={() => send('GO_TO_ADDRESS_STEP')}
                  testId="continue-shipping-button"
                >
                  <span className="f5">
                    <FormattedMessage id="store/checkout.shipping.goToAddress" />
                  </span>
                </Button>
              </div>
            )}
        </>
      )
    }

    case matches('selectAddress'): {
      return (
        <AddressList
          hasError={matches({ selectAddress: 'error' })}
          isSubmitting={matches({ selectAddress: 'submitting' })}
          addresses={state.context.availableAddresses}
          selectedAddress={state.context.selectedAddress}
          onCreateAddress={() => send('GO_TO_CREATE_ADDRESS')}
          onAddressSelected={(address) =>
            send({ type: 'SUBMIT_SELECT_ADDRESS', address })
          }
          onRetrySelectAddress={() => {
            send('RETRY_SELECT_ADDRESS', {
              address: state.context.retryAddress!,
            })
          }}
          onEditAddress={() => send('EDIT_ADDRESS')}
        />
      )
    }

    case matches('createAddress'):

    // eslint-disable-next-line no-fallthrough
    default: {
      return (
        <NewAddressForm
          onAddressCreated={handleAddressCreated}
          onEditAddress={() => send('EDIT_ADDRESS')}
          onRetryCreateAddress={() => {
            send('RETRY_CREATE_ADDRESS', {
              address: state.context.retryAddress!,
            })
          }}
          isSubmitting={matches({ createAddress: 'submitting' })}
          hasError={matches({ createAddress: 'error' })}
        />
      )
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
