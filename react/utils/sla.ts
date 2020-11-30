import { DeliveryOption, PickupOption } from 'vtex.checkout-graphql'

export const getName = (shippingOption: DeliveryOption | PickupOption) => {
  return shippingOption.deliveryChannel === 'pickup-in-point'
    ? (shippingOption as PickupOption).friendlyName
    : shippingOption.id
}
