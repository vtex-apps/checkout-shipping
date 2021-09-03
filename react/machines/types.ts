import type {
  Address,
  DeliveryOption,
  PickupOption,
} from 'vtex.checkout-graphql'

export interface ShippingMachineContext {
  availableAddresses: Address[]
  canEditData: boolean
  selectedAddress: Address | null
  retryAddress: Address | null
  userProfileId?: string | null
  editingAddressId?: string | null
  hasHistory: boolean
}

export type ShippingMachineEvents =
  | { type: 'GO_TO_CREATE_ADDRESS' }
  | { type: 'GO_TO_SELECT_ADDRESS' }
  | { type: 'GO_TO_ADDRESS_STEP' }
  | { type: 'DESELECT_SHIPPING_OPTION' }
  | { type: 'EDIT_ADDRESS' }
  | { type: 'TOGGLE_CARBON_FREE_SHIPPING'; carbonFreeChecked: boolean }
  | { type: 'SUBMIT_SELECT_ADDRESS' | 'RETRY_SELECT_ADDRESS'; address: Address }
  | {
      type: 'SUBMIT_SELECT_SHIPPING_OPTION'
      shippingOptionId: string
      deliveryChannel: string
    }
  | { type: 'SUBMIT_CREATE_ADDRESS' | 'RETRY_CREATE_ADDRESS'; address: Address }
  | {
      type: 'done.invoke.tryToCreateAddress'
      data: {
        orderForm: {
          shipping: {
            availableAddresses: Address[]
            deliveryOptions: DeliveryOption[]
            pickupOptions: PickupOption[]
            selectedAddress: Address
          }
        }
      }
    }
  | {
      type: 'error.platform.tryToCreateAddress'
      data: Address
    }
  | {
      type: 'done.invoke.tryToSelectAddress'
      data: {
        orderForm: {
          shipping: {
            deliveryOptions: DeliveryOption[]
            pickupOptions: PickupOption[]
            selectedAddress: Address
          }
        }
      }
    }
  | {
      type: 'error.platform.tryToSelectAddress'
      data: Address
    }
  | {
      type: 'done.invoke.tryToSelectShippingOption'
      data: {
        success: boolean
      }
    }

export type AddressMachineEvents =
  | { type: 'SUBMIT_RECEIVER_INFO'; receiverName: string }
  | { type: 'EDIT_ADDRESS' }
  | {
      type: 'SUBMIT_EDIT_ADDRESS'
      updatedAddress: Address
    }
  | { type: 'RESET_ADDRESS' }
  | {
      type: 'done.invoke.tryToUpdateCompleteAddress'
      data: {
        success: boolean
        orderForm: {
          shipping: {
            deliveryOptions: DeliveryOption[]
            pickupOptions: PickupOption[]
            selectedAddress: Address
          }
        }
        buyerIsReceiver: boolean
      }
    }
