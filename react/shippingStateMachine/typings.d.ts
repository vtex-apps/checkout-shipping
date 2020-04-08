import { Address, DeliveryOption } from 'vtex.checkout-graphql'

type MaybeState<T, U> = U extends true ? Record<'states', T> : T | keyof T

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : DeepPartial<T[P]>
}

export interface ShippingMachineContext {
  selectedAddress: Address | null
  availableAddresses: Address[]
  deliveryOptions: DeliveryOption[]
}

export type ShippingMachineEvents =
  | { type: 'EDIT_RECEIVER_INFO' }
  | { type: 'GO_TO_CREATE_ADDRESS' }
  | { type: 'SELECT_ADDRESS' }
  | { type: 'SUBMIT_COMPLETE_ADDRESS' }
  | { type: 'SUBMIT_RECEIVER_INFO' }
  | { type: 'SUBMIT_SELECT_DELIVERY_OPTION' }
  | { type: 'SUBMIT' }
  | {
      type: 'done.invoke.tryToInsertAddress'
      data: { deliveryOptions: DeliveryOption[] }
    }
  | {
      type: 'done.invoke.tryToSelectAddress'
      data: { selectedAddress: Address }
    }

interface ShippingMachineStates<HasStates = false> {
  states: {
    initial: {}
    createAddress: MaybeState<
      {
        editing: {}
        submitting: {}
      },
      HasStates
    >
    editReceiverInfo: MaybeState<
      {
        editing: {}
        submitting: {}
      },
      HasStates
    >
    completeAddress: MaybeState<
      {
        editing: {}
        submitting: {}
      },
      HasStates
    >
    selectAddress: MaybeState<
      {
        idle: {}
        submitting: {}
      },
      HasStates
    >
    selectDeliveryOption: MaybeState<
      {
        editing: {}
        submitting: {}
      },
      HasStates
    >
    done: {}
  }
}

export type ShippingMachineStateSchema = ShippingMachineStates<true>
