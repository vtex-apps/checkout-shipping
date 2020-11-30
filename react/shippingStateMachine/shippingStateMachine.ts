import { assign, Machine } from 'xstate'

import type {
  ShippingMachineContext,
  ShippingMachineStateSchema,
  ShippingMachineEvents,
} from './types'

const shippingStateMachine = Machine<
  ShippingMachineContext,
  ShippingMachineStateSchema,
  ShippingMachineEvents
>(
  {
    id: 'shipping',
    initial: 'initial',
    context: {
      availableAddresses: [],
      canEditData: true,
      deliveryOptions: [],
      pickupOptions: [],
      selectedAddress: null,
      userProfileId: null,
      isAddressValid: false,
    },
    states: {
      initial: {
        on: {
          '': [
            { target: 'selectShippingOption', cond: 'hasSelectedAddress' },
            { target: 'selectAddress', cond: 'hasAvailableAddresses' },
            { target: 'createAddress' },
          ],
        },
      },
      createAddress: {
        initial: 'editing',
        states: {
          editing: {
            on: {
              SUBMIT_CREATE_ADDRESS: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToCreateAddress',
              onDone: {
                target: '#shipping.selectShippingOption',
                actions: [
                  'updateSelectDeliveryOptions',
                  'updateSelectedAddress',
                ],
              },
            },
          },
        },
      },
      selectAddress: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              '': [
                {
                  target: '#shipping.createAddress',
                  cond: 'hasNoAvailableAddresses',
                },
                {
                  target: '#shipping.createAddress',
                  cond: 'isFirstPurchase',
                },
              ],
              GO_TO_CREATE_ADDRESS: '#shipping.createAddress',
              SUBMIT_SELECT_ADDRESS: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToSelectAddress',
              onDone: {
                target: '#shipping.selectShippingOption',
                actions: 'updateSelectedAddress',
              },
            },
          },
        },
      },
      selectShippingOption: {
        initial: 'editing',
        states: {
          editing: {
            on: {
              EDIT_ADDRESS: [
                {
                  target: '#shipping.completeAddress',
                  cond: 'firstPurchaseCompleteAddress',
                },
                {
                  target: '#shipping.createAddress',
                  cond: 'firstPurchaseIncompleteAddress',
                },
                {
                  target: '#shipping.selectAddress',
                },
              ],
              SUBMIT_SELECT_SHIPPING_OPTION: 'submitting',
              EDIT_RECEIVER_INFO: [
                {
                  cond: 'canEditReceiverInfo',
                  target: '#shipping.editReceiverInfo',
                },
                { actions: 'requestLogin' },
              ],
            },
          },
          submitting: {
            invoke: {
              src: 'tryToSelectShippingOption',
              onDone: [
                {
                  target: '#shipping.completeAddress',
                  cond: 'hasIncompleteSelectedAddress',
                },
                { target: '#shipping.done' },
              ],
            },
          },
        },
      },
      completeAddress: {
        initial: 'editing',
        states: {
          editing: {
            on: {
              SUBMIT_COMPLETE_ADDRESS: 'submitting',
              GO_TO_SELECT_SHIPPING_OPTION: '#shipping.selectShippingOption',
              RESET_ADDRESS: '#shipping.selectAddress',
              EDIT_RECEIVER_INFO: '#shipping.editReceiverInfo',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToUpdateCompleteAddress',
              onDone: [
                {
                  target: '#shipping.done',
                  actions: 'updateSelectedAddress',
                  cond: 'buyerIsReceiver',
                },
                {
                  target: '#shipping.editReceiverInfo',
                  actions: 'updateSelectedAddress',
                },
              ],
            },
          },
        },
      },
      editReceiverInfo: {
        initial: 'editing',
        on: {
          GO_TO_CREATE_ADDRESS: 'createAddress',
          GO_TO_SELECT_SHIPPING_OPTION: '#shipping.selectShippingOption',
          EDIT_ADDRESS: '#shipping.completeAddress',
        },
        states: {
          editing: {
            on: {
              SUBMIT_RECEIVER_INFO: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToEditReceiverInfo',
              onDone: {
                target: '#shipping.done',
                actions: 'updateSelectedAddress',
              },
            },
          },
        },
      },
      done: {
        entry: 'goToNextStep',
      },
    },
  },
  {
    actions: {
      goToNextStep: () => {},
      requestLogin: () => {},
      updateSelectDeliveryOptions: assign((_, event) => {
        if (event.type === 'done.invoke.tryToCreateAddress') {
          return {
            deliveryOptions: event.data.orderForm.shipping.deliveryOptions,
            selectedAddress: event.data.orderForm.shipping.selectedAddress,
          }
        }

        return {}
      }),
    },
    guards: {
      canEditReceiverInfo: ({ canEditData, selectedAddress }) =>
        canEditData || !!selectedAddress?.isDisposable,
      hasSelectedAddress: ({ selectedAddress }) => selectedAddress != null,
      hasNoAvailableAddresses: ({ availableAddresses }) =>
        availableAddresses.length === 0,
      hasAvailableAddresses: ({ availableAddresses }) =>
        availableAddresses.length !== 0,
      hasIncompleteSelectedAddress: ({ selectedAddress }) =>
        !!selectedAddress &&
        (selectedAddress.addressType == null ||
          selectedAddress.receiverName == null),
      buyerIsReceiver: ({ selectedAddress, canEditData }, event) => {
        if (event.type === 'done.invoke.tryToUpdateCompleteAddress') {
          return (
            event.data.buyerIsReceiver &&
            (!selectedAddress?.isDisposable || canEditData)
          )
        }

        return !selectedAddress?.isDisposable
      },
      isFirstPurchase: ({ canEditData, userProfileId }) =>
        canEditData && !userProfileId,
      firstPurchaseCompleteAddress: ({
        canEditData,
        userProfileId,
        isAddressValid,
      }) => canEditData && !userProfileId && isAddressValid,
      firstPurchaseIncompleteAddress: ({
        canEditData,
        userProfileId,
        isAddressValid,
      }) => canEditData && !userProfileId && !isAddressValid,
    },
  }
)

export default shippingStateMachine
