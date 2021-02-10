import { useMachine } from '@xstate/react'
import { Router, routes } from 'vtex.checkout-container'
import { OrderShipping } from 'vtex.order-shipping'
import { AddressContext } from 'vtex.address-context'
import { assign } from 'xstate'

import addressStateMachine from './addressStateMachine'
import type { AddressMachineEvents } from './types'
import useMatcher from './useMatcher'

const { useHistory } = Router
const { useOrderShipping } = OrderShipping
const { useAddressContext } = AddressContext

const useAddressStateMachine = () => {
  const { updateSelectedAddress } = useOrderShipping()
  const { setAddress } = useAddressContext()

  const history = useHistory()

  const [state, send] = useMachine<unknown, AddressMachineEvents>(
    addressStateMachine,
    {
      devTools: true,
      actions: {
        goToNextStep: () => history.push(routes.PAYMENT),
        goToCreateAddress: () => {
          history.push(routes.SHIPPING)
        },
        updateSelectedAddress: assign((_, event) => {
          if (event.type === 'done.invoke.tryToUpdateCompleteAddress') {
            const updatedAddress = event.data.orderForm.shipping.selectedAddress

            setAddress(updatedAddress)

            return {}
          }

          return {}
        }),
      },
      services: {
        tryToUpdateCompleteAddress: async (_, event) => {
          if (event.type !== 'SUBMIT_EDIT_ADDRESS') {
            return
          }

          const result = await updateSelectedAddress(event.updatedAddress)

          return result
        },
      },
    }
  )

  const matches = useMatcher<unknown, AddressMachineEvents>(state)

  return { matches, send, state }
}

export default useAddressStateMachine
