import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'

export const isPickupOption = (
  shippingOption: DeliveryOption | PickupOption
): shippingOption is PickupOption => {
  return shippingOption.deliveryChannel === 'pickup-in-point'
}

export const getName = (shippingOption: DeliveryOption | PickupOption) => {
  return isPickupOption(shippingOption)
    ? shippingOption.friendlyName
    : shippingOption.id
}
