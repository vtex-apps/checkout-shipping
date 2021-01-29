import { assign, Machine } from 'xstate'

import type { ShippingMachineContext, ShippingMachineEvents } from './types'

const shippingStateMachine = Machine<
  ShippingMachineContext,
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
      editingAddressId: null,
    },
    states: {
      initial: {
        always: [
          { target: 'selectShippingOption', cond: 'hasSelectedAddress' },
          { target: 'selectAddress', cond: 'hasAvailableAddresses' },
          { target: 'createAddress' },
        ],
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
                  'clearEditingAddressId',
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
            always: [
              {
                target: '#shipping.createAddress',
                cond: 'hasNoAvailableAddresses',
              },
              {
                target: '#shipping.createAddress',
                cond: 'isFirstPurchase',
              },
            ],
            on: {
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
                  cond: 'isFirstPurchaseCompleteAddress',
                  actions: 'updateEditingAddressId',
                },
                {
                  target: '#shipping.createAddress',
                  cond: 'isFirstPurchaseIncompleteAddress',
                  actions: 'updateEditingAddressId',
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
              RESET_ADDRESS: {
                target: '#shipping.selectAddress',
                actions: 'clearEditingAddressId',
              },
              EDIT_RECEIVER_INFO: '#shipping.editReceiverInfo',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToUpdateCompleteAddress',
              onDone: [
                {
                  target: '#shipping.done',
                  actions: ['updateSelectedAddress', 'clearEditingAddressId'],
                  cond: 'buyerIsReceiver',
                },
                {
                  target: '#shipping.editReceiverInfo',
                  actions: ['updateSelectedAddress', 'clearEditingAddressId'],
                },
              ],
            },
          },
        },
      },
      editReceiverInfo: {
        initial: 'editing',
        on: {
          GO_TO_SELECT_SHIPPING_OPTION: {
            target: '#shipping.selectShippingOption',
            actions: 'clearEditingAddressId',
          },
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
                actions: ['updateSelectedAddress', 'clearEditingAddressId'],
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
      updateEditingAddressId: assign((ctx) => {
        return {
          editingAddressId: ctx.selectedAddress?.addressId,
        }
      }),
      clearEditingAddressId: assign((_) => {
        return {
          editingAddressId: null,
        }
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
      isFirstPurchaseCompleteAddress: ({
        canEditData,
        userProfileId,
        isAddressValid,
      }) => canEditData && !userProfileId && isAddressValid,
      isFirstPurchaseIncompleteAddress: ({
        canEditData,
        userProfileId,
        isAddressValid,
      }) => canEditData && !userProfileId && !isAddressValid,
    },
  }
)

export default shippingStateMachine
