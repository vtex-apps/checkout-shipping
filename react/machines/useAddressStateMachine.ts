import { useMachine } from '@xstate/react'
import { Router, routes } from 'vtex.checkout-container'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'
import { assign } from 'xstate'

import addressStateMachine from './addressStateMachine'
import { AddressMachineContext, AddressMachineEvents } from './types'
import useMatcher from './useMatcher'

const { useHistory } = Router
const { useOrderShipping } = OrderShipping
const { useAddressContext } = AddressContext

const useAddressStateMachine = ({
  isAddressValid,
  selectedAddress,
}: AddressMachineContext) => {
  const { updateSelectedAddress } = useOrderShipping()
  const { setAddress } = useAddressContext()

  const history = useHistory()

  const [state, send] = useMachine<AddressMachineContext, AddressMachineEvents>(
    addressStateMachine,
    {
      devTools: true,
      context: {
        isAddressValid,
        selectedAddress,
      },
      actions: {
        goToNextStep: () => history.push(routes.PAYMENT),
        goToCreateAddress: () => {
          history.push(routes.SHIPPING)
        },
        updateSelectedAddress: assign((_, event) => {
          if (
            event.type === 'done.invoke.tryToUpdateCompleteAddress' ||
            event.type === 'done.invoke.tryToEditReceiverInfo'
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
        tryToUpdateCompleteAddress: async (_, event) => {
          if (event.type !== 'SUBMIT_EDIT_ADDRESS') {
            return
          }

          const result = await updateSelectedAddress(event.updatedAddress)

          return { ...result, buyerIsReceiver: event.buyerIsReceiver }
        },
      },
    }
  )

  const matches = useMatcher<AddressMachineContext, AddressMachineEvents>(state)

  return { matches, send, state }
}

export default useAddressStateMachine
