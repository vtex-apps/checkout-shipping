import { useMachine } from '@xstate/react'
import { Router, routes } from 'vtex.checkout-container'
import { OrderShipping } from 'vtex.order-shipping'
import { assign } from 'xstate'
import { AddressContext } from 'vtex.address-context'
import { useContext } from 'react'

import shippingStateMachine from './shippingStateMachine'
import type { ShippingMachineContext, ShippingMachineEvents } from './types'
import useMatcher from './useMatcher'

const { useOrderShipping } = OrderShipping
const { useAddressContext } = AddressContext

const useShippingStateMachine = ({
  availableAddresses,
  selectedAddress,
  canEditData,
  userProfileId,
}: Omit<ShippingMachineContext, 'hasHistory'>) => {
  const {
    insertAddress,
    selectDeliveryOption,
    selectPickupOption,
    updateSelectedAddress,
    estimateCarbonFreeShipping,
    clearCarbonFreeShipping,
  } = useOrderShipping()

  const { setAddress } = useAddressContext()

  const history = useContext(Router.__RouterContext)?.history

  const [state, send] = useMachine<
    ShippingMachineContext,
    ShippingMachineEvents
  >(shippingStateMachine, {
    devTools: true,
    context: {
      availableAddresses,
      selectedAddress,
      canEditData,
      userProfileId,
      hasHistory: !!history,
    },
    actions: {
      goToNextStep: () => history?.push(routes.ADDRESS),
      toggleCarbonFreeShipping: (_, event) => {
        if (event.type !== 'TOGGLE_CARBON_FREE_SHIPPING') {
          return
        }

        if (!event.carbonFreeChecked) {
          estimateCarbonFreeShipping()
        } else {
          clearCarbonFreeShipping()
        }
      },
      updateAddressContext: (_, event) => {
        if (
          event.type !== 'SUBMIT_CREATE_ADDRESS' &&
          event.type !== 'SUBMIT_SELECT_ADDRESS'
        ) {
          return
        }

        setAddress(event.address)
      },
      updateSelectedAddress: assign((_, event) => {
        if (
          event.type === 'done.invoke.tryToCreateAddress' ||
          event.type === 'done.invoke.tryToSelectAddress'
        ) {
          const updatedAddress = event.data.orderForm.shipping.selectedAddress

          setAddress(updatedAddress)

          return {
            selectedAddress: event.data.orderForm.shipping.selectedAddress,
          }
        }

        return {}
      }),
    },
    services: {
      tryToCreateAddress: async (_, event) => {
        if (
          event.type !== 'SUBMIT_CREATE_ADDRESS' &&
          event.type !== 'RETRY_CREATE_ADDRESS'
        ) {
          return
        }

        try {
          return await insertAddress(event.address)
        } catch {
          throw event.address
        }
      },
      tryToSelectAddress: async (_, event) => {
        if (
          event.type !== 'SUBMIT_SELECT_ADDRESS' &&
          event.type !== 'RETRY_SELECT_ADDRESS'
        ) {
          return
        }

        try {
          return await updateSelectedAddress(event.address)
        } catch {
          throw event.address
        }
      },
      tryToSelectShippingOption: async (_, event) => {
        if (event.type !== 'SUBMIT_SELECT_SHIPPING_OPTION') {
          return
        }

        if (event.deliveryChannel === 'delivery') {
          return selectDeliveryOption(event.shippingOptionId)
        }

        return selectPickupOption(event.shippingOptionId)
      },
    },
  })

  const matches = useMatcher<ShippingMachineContext, ShippingMachineEvents>(
    state
  )

  return { matches, send, state }
}

export default useShippingStateMachine
