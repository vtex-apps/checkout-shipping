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
  availableAddresses: Address[]
  canEditData: boolean
  deliveryOptions: DeliveryOption[]
  selectedAddress: Address | null
  userProfileId: string | null | undefined
  isAddressValid: boolean
}

export type ShippingMachineEvents =
  | { type: 'EDIT_RECEIVER_INFO' }
  | { type: 'GO_TO_CREATE_ADDRESS' }
  | { type: 'GO_TO_SELECT_DELIVERY_OPTION' }
  | { type: 'GO_TO_SELECT_ADDRESS' }
  | { type: 'EDIT_ADDRESS' }
  | { type: 'RESET_ADDRESS' }
  | { type: 'SUBMIT_SELECT_ADDRESS'; address: Address }
  | {
      type: 'SUBMIT_COMPLETE_ADDRESS'
      updatedAddress: Address
      buyerIsReceiver: boolean
    }
  | { type: 'SUBMIT_RECEIVER_INFO'; receiverName: string }
  | { type: 'SUBMIT_SELECT_DELIVERY_OPTION'; deliveryOptionId: string }
  | { type: 'SUBMIT_CREATE_ADDRESS'; address: Address }
  | {
      type: 'done.invoke.tryToCreateAddress'
      data: {
        orderForm: {
          shipping: {
            deliveryOptions: DeliveryOption[]
            selectedAddress: Address
          }
        }
      }
    }
  | {
      type:
        | 'done.invoke.tryToSelectAddress'
        | 'done.invoke.tryToEditReceiverInfo'
      data: {
        orderForm: {
          shipping: {
            deliveryOptions: DeliveryOption[]
            selectedAddress: Address
          }
        }
      }
    }
  | {
      type: 'done.invoke.tryToUpdateCompleteAddress'
      data: { success: boolean; buyerIsReceiver: boolean }
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

export type ShippingMachineState =
  | DeepPartial<ShippingMachineStates['states']>
  | keyof ShippingMachineStates['states']
