import { Address, DeliveryOption, PickupOption } from 'vtex.checkout-graphql'

export interface ShippingMachineContext {
  availableAddresses: Address[]
  canEditData: boolean
  deliveryOptions: DeliveryOption[]
  pickupOptions: PickupOption[]
  selectedAddress: Address | null
  userProfileId?: string | null
  isAddressValid: boolean
  editingAddressId?: string | null
}

export type ShippingMachineEvents =
  | { type: 'EDIT_RECEIVER_INFO' }
  | { type: 'GO_TO_CREATE_ADDRESS' }
  | { type: 'GO_TO_SELECT_SHIPPING_OPTION' }
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
  | {
      type: 'SUBMIT_SELECT_SHIPPING_OPTION'
      shippingOptionId: string
      deliveryChannel: string
    }
  | { type: 'SUBMIT_CREATE_ADDRESS'; address: Address }
  | {
      type: 'done.invoke.tryToCreateAddress'
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
      type:
        | 'done.invoke.tryToSelectAddress'
        | 'done.invoke.tryToEditReceiverInfo'
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
