import { useMachine } from '@xstate/react'
import { useMemo } from 'react'
import { Router } from 'vtex.checkout-container'
import { OrderShipping } from 'vtex.order-shipping'
import { State } from 'xstate'

import shippingStateMachine from './shippingStateMachine'
import { ShippingMachineContext, ShippingMachineState } from './typings'

const { useOrderShipping } = OrderShipping
const { useHistory } = Router

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
      goToNextStep: () => history.push('/payment'),
    },
    services: {
      tryToEditReceiverInfo: (ctx, { receiverName }) => {
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
