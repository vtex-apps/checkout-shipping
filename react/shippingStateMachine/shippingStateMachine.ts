import { assign, Machine } from 'xstate'

import {
  ShippingMachineContext,
  ShippingMachineStateSchema,
  ShippingMachineEvents,
} from './typings'

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
      selectedAddress: null,
      userProfileId: null,
      isAddressValid: false,
    },
    states: {
      initial: {
        on: {
          '': [
            { target: 'selectDeliveryOption', cond: 'hasSelectedAddress' },
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
                target: '#shipping.selectDeliveryOption',
                actions: 'updateSelectDeliveryOptions',
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
                target: '#shipping.selectDeliveryOption',
                actions: 'updateSelectedAddress',
              },
            },
          },
        },
      },
      selectDeliveryOption: {
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
              SUBMIT_SELECT_DELIVERY_OPTION: 'submitting',
              EDIT_RECEIVER_INFO: '#shipping.editReceiverInfo',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToSelectDeliveryOption',
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
              GO_TO_SELECT_DELIVERY_OPTION: '#shipping.selectDeliveryOption',
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
          GO_TO_SELECT_DELIVERY_OPTION: '#shipping.selectDeliveryOption',
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
      updateSelectDeliveryOptions: assign((_, event) => {
        if (event.type === 'done.invoke.tryToCreateAddress') {
          return {
            deliveryOptions: event.data.orderForm.shipping.deliveryOptions,
            selectedAddress: event.data.orderForm.shipping.selectedAddress,
          }
        }
        return {}
      }),
      updateSelectedAddress: assign((_, event) => {
        if (
          event.type === 'done.invoke.tryToSelectAddress' ||
          event.type === 'done.invoke.tryToEditReceiverInfo' ||
          event.type === 'done.invoke.tryToUpdateCompleteAddress'
        ) {
          return {
            selectedAddress: event.data.orderForm.shipping.selectedAddress,
          }
        }
        return {}
      }),
    },
    guards: {
      hasSelectedAddress: ({ selectedAddress }) => selectedAddress != null,
      hasNoAvailableAddresses: ({ availableAddresses }) =>
        availableAddresses.length === 0,
      hasAvailableAddresses: ({ availableAddresses }) =>
        availableAddresses.length !== 0,
      hasIncompleteSelectedAddress: ({ selectedAddress }) =>
        !!selectedAddress &&
        (selectedAddress.addressType == null ||
          selectedAddress.receiverName == null),
      buyerIsReceiver: (_, event) => {
        if (event.type === 'done.invoke.tryToUpdateCompleteAddress') {
          return event.data.buyerIsReceiver
        }
        return false
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
