import { useMachine } from '@xstate/react'
import { useMemo, useCallback } from 'react'
import { Router, routes, ContainerContext } from 'vtex.checkout-container'
import { OrderShipping } from 'vtex.order-shipping'
import { State, assign, EventObject, Typestate } from 'xstate'
import { AddressContext } from 'vtex.address-context'

import shippingStateMachine from './shippingStateMachine'
import { ShippingMachineContext, ShippingMachineEvents } from './types'

const { useHistory } = Router
const { useOrderShipping } = OrderShipping
const { useCheckoutContainer } = ContainerContext
const { useAddressContext } = AddressContext

export const useMatcher = <Context, Events extends EventObject>(
  state: State<Context, Events>
) =>
  useCallback((params: Typestate<Context>['value']) => state.matches(params), [
    state,
  ])

const useShippingStateMachine = ({
  availableAddresses,
  deliveryOptions,
  pickupOptions,
  selectedAddress,
  canEditData,
  userProfileId,
  isAddressValid,
}: ShippingMachineContext) => {
  const {
    insertAddress,
    selectDeliveryOption,
    selectPickupOption,
    updateSelectedAddress,
  } = useOrderShipping()

  const { setAddress } = useAddressContext()

  const { requestLogin } = useCheckoutContainer()

  const history = useHistory()

  const [state, send] = useMachine<
    ShippingMachineContext,
    ShippingMachineEvents
  >(shippingStateMachine, {
    devTools: true,
    context: {
      availableAddresses,
      selectedAddress,
      deliveryOptions,
      pickupOptions,
      canEditData,
      userProfileId,
      isAddressValid,
    },
    actions: {
      goToNextStep: () => history.push(routes.PAYMENT),
      requestLogin: () => requestLogin(),
      updateSelectedAddress: assign((_, event) => {
        if (
          event.type === 'done.invoke.tryToCreateAddress' ||
          event.type === 'done.invoke.tryToSelectAddress' ||
          event.type === 'done.invoke.tryToEditReceiverInfo' ||
          event.type === 'done.invoke.tryToUpdateCompleteAddress'
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
      tryToEditReceiverInfo: async (ctx, event) => {
        if (event.type !== 'SUBMIT_RECEIVER_INFO') {
          return
        }

        return updateSelectedAddress({
          ...ctx.selectedAddress,
          receiverName: event.receiverName,
        })
      },
      tryToCreateAddress: async (ctx, event) => {
        if (event.type !== 'SUBMIT_CREATE_ADDRESS') {
          return
        }

        return insertAddress(
          ctx.editingAddressId != null
            ? { ...event.address, addressId: ctx.editingAddressId }
            : event.address
        )
      },
      tryToSelectAddress: async (_, event) => {
        if (event.type !== 'SUBMIT_SELECT_ADDRESS') {
          return
        }

        return updateSelectedAddress(event.address)
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
      tryToUpdateCompleteAddress: async (_, event) => {
        if (event.type !== 'SUBMIT_COMPLETE_ADDRESS') {
          return
        }

        const result = await updateSelectedAddress(event.updatedAddress)

        return { ...result, buyerIsReceiver: event.buyerIsReceiver }
      },
    },
  })

  const matches = useMatcher<ShippingMachineContext, ShippingMachineEvents>(
    state
  )

  return useMemo(() => ({ matches, send, state }), [matches, send, state])
}

export default useShippingStateMachine
