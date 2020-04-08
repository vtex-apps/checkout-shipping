import { assign, actions, Machine, send } from 'xstate'

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
      selectedAddress: null,
      availableAddresses: [],
      deliveryOptions: [],
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
              SUBMIT: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToInsertAddress',
              onDone: {
                target: '#shipping.selectDeliveryOption',
                actions: assign((_, event) => {
                  return { deliveryOptions: event.data.deliveryOptions }
                }),
              },
            },
          },
        },
      },
      selectAddress: {
        initial: 'idle',
        on: {
          GO_TO_CREATE_ADDRESS: 'createAddress',
        },
        states: {
          idle: {
            on: {
              SELECT_ADDRESS: 'submitting',
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
              SELECT_ADDRESS: '#shipping.selectAddress',
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
        on: {
          GO_TO_CREATE_ADDRESS: 'createAddress',
        },
        states: {
          editing: {
            on: {
              SUBMIT_COMPLETE_ADDRESS: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToUpdateCompleteAddress',
              onDone: [
                {
                  target: '#shipping.done',
                  // actions: "updateSelectedAddress",
                  cond: 'buyerIsReceiver',
                },
                {
                  target: '#shipping.editReceiverInfo',
                  // actions: "updateSelectedAddress",
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
                target: '#shipping.selectDeliveryOption',
                actions: 'updateSelectedAddress',
              },
            },
          },
        },
      },
      done: {},
    },
  },
  {
    actions: {
      updateSelectDeliveryOptions: assign((_, event) => {
        if (event.type === 'done.invoke.tryToInsertAddress') {
          return {
            deliveryOptions: event.data.deliveryOptions,
          }
        }
        alert('deu ruim')
        return {}
      }),
      updateSelectedAddress: assign((_, event) => {
        if (event.type === 'done.invoke.tryToSelectAddress') {
          return {
            selectedAddress: event.data.selectedAddress,
          }
        }
        return {}
      }),
    },
    guards: {
      hasSelectedAddress: ({ selectedAddress }) => selectedAddress != null,
      hasAvailableAddresses: ({ availableAddresses }) =>
        availableAddresses.length !== 0,
      hasIncompleteSelectedAddress: ({ selectedAddress }) =>
        !!selectedAddress && selectedAddress.addressType == null,
      buyerIsReceiver: (_, event) => event.buyerIsReceiver,
    },
    services: {
      tryToInsertAddress: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ deliveryOptions: ['lalalal'] })
          }, 250)
        }),
      tryToSelectDeliveryOption: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 250)
        }),
      tryToSelectAddress: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ selectedAddress: { addressType: '12o12o' } })
          }, 250)
        }),
      tryToUpdateCompleteAddress: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve({ selectedAddress: { addressType: 'adfla' } })
          }, 250)
        }),
      tryToEditReceiverInfo: () =>
        new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 250)
        }),
    },
  }
)

export default shippingStateMachine
