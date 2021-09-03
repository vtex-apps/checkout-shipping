import type { MouseEvent, KeyboardEvent } from 'react'
import React, { useCallback, useState } from 'react'
import classNames from 'classnames'
import type { Address } from 'vtex.checkout-graphql'
import { OrderForm } from 'vtex.order-manager'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'
import { Button, Toggle, IconInfo, Tooltip } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { Loading } from 'vtex.render-runtime'

import NewAddressForm from './NewAddressForm'
import AddressList from './components/AddressList'
import ShippingOptionList from './ShippingOptionList'
import useShippingStateMachine from './machines/useShippingStateMachine'
import useAddressRules from './useAddressRules'
import ShippingHeader from './ShippingHeader'
import CarbonFreeIcon from './components/CarbonFreeIcon'
import styles from './styles.css'

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

  const [carbonFreeChecked, setCarbonFreeChecked] = useState(
    deliveryOptions.some(({ carbonEstimate }) => carbonEstimate != null)
  )

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

  const handleCarbonFreeChange = (event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation()

    setCarbonFreeChecked(!carbonFreeChecked)
    send({
      type: 'TOGGLE_CARBON_FREE_SHIPPING',
      carbonFreeChecked,
    })
  }

  switch (true) {
    case matches('selectShippingOption'): {
      return (
        <>
          <ShippingHeader onEditAddress={() => send('EDIT_ADDRESS')} />

          <div
            className={classNames(
              'mv7 ba pl5 pv3 pr3 br3 flex items-center justify-between w-100 pointer',
              {
                'b--muted-4 hover-b--muted-2': !carbonFreeChecked,
                [`b--success ${styles.carbonToggleContainerSuccess}`]: carbonFreeChecked,
              }
            )}
            tabIndex={0}
            role="button"
            onKeyPress={handleCarbonFreeChange}
            onClick={handleCarbonFreeChange}
          >
            <div className="flex">
              <Toggle
                label="Make my order carbon neutral"
                checked={carbonFreeChecked}
                onChange={handleCarbonFreeChange}
              />
              <Tooltip label="Contribute to the carbon offset of this purchase">
                {/* eslint-disable-next-line */}
                <div
                  className="c-muted-3 ml2 mt1 dn-s db-ns"
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconInfo />
                </div>
              </Tooltip>
            </div>
            <CarbonFreeIcon />
          </div>

          <ShippingOptionList
            deliveryOptions={deliveryOptions}
            pickupOptions={pickupOptions}
            carbonFreeChecked={carbonFreeChecked}
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
          hasAvailableAddresses={matches({
            createAddress: { editing: 'withListBacklink' },
          })}
          onViewAddressList={() => send('GO_TO_SELECT_ADDRESS')}
        />
      )
    }
  }
}

const ShippingFormWithAddress: React.FC = () => {
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
      <ShippingForm />
    </AddressContext.AddressContextProvider>
  )
}

export default ShippingFormWithAddress
