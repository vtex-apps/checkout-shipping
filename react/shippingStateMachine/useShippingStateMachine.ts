import { useMachine } from '@xstate/react'
import { useMemo } from 'react'
import { Router, routes, ContainerContext } from 'vtex.checkout-container'
import { OrderShipping } from 'vtex.order-shipping'
import { State, assign } from 'xstate'
import { AddressContext } from 'vtex.address-context'

import shippingStateMachine from './shippingStateMachine'
import { ShippingMachineContext, ShippingMachineState } from './types'

const { useHistory } = Router
const { useOrderShipping } = OrderShipping
const { useCheckoutContainer } = ContainerContext
const { useAddressContext } = AddressContext

export const useMatcher = <T, U>(state: State<U>) => (params: T) =>
  state.matches(params)

const useShippingStateMachine = ({
  availableAddresses,
  deliveryOptions,
  selectedAddress,
  canEditData,
  userProfileId,
  isAddressValid,
}: ShippingMachineContext) => {
  const {
    insertAddress,
    selectDeliveryOption,
    updateSelectedAddress,
  } = useOrderShipping()

  const { setAddress } = useAddressContext()

  const { requestLogin } = useCheckoutContainer()

  const history = useHistory()

  const [state, send] = useMachine(shippingStateMachine, {
    devTools: true,
    context: {
      availableAddresses,
      selectedAddress,
      deliveryOptions,
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
      tryToEditReceiverInfo: (ctx, { receiverName }) => {
        console.log(ctx, receiverName);
        return updateSelectedAddress({
          ...ctx.selectedAddress,
          receiverName,
        })
      },
      tryToCreateAddress: (_, event) => {
        return insertAddress(event.address)
      },
      tryToSelectAddress: (_, event) => {
        return updateSelectedAddress(event.address)
      },
      tryToSelectDeliveryOption: (_, event) => {
        return selectDeliveryOption(event.deliveryOptionId)
      },
      tryToUpdateCompleteAddress: async (_, event) => {
        const result = await updateSelectedAddress(event.updatedAddress)

        return { ...result, buyerIsReceiver: event.buyerIsReceiver }
      },
    },
  })

  const matches = useMatcher<ShippingMachineState, ShippingMachineContext>(
    state
  )

  return useMemo(() => ({ matches, send, state }), [matches, send, state])
}

export default useShippingStateMachine
