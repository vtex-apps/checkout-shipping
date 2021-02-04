import { Address, DeliveryOption, PickupOption } from 'vtex.checkout-graphql'

export interface ShippingMachineContext {
  availableAddresses: Address[]
  canEditData: boolean
  selectedAddress: Address | null
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
  | { type: 'SUBMIT_SELECT_ADDRESS'; address: Address }
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
      type: 'done.invoke.tryToSelectShippingOption'
      data: {
        success: boolean
      }
    }
