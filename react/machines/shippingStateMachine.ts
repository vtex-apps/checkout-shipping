import { assign, Machine } from 'xstate'

import type { ShippingMachineContext, ShippingMachineEvents } from './types'

const hasSelectedAddress = ({ selectedAddress }: ShippingMachineContext) =>
  selectedAddress != null

const hasNoAvailableAddresses = ({
  availableAddresses,
}: ShippingMachineContext) => availableAddresses.length === 0

const hasAvailableAddresses = ({
  availableAddresses,
}: ShippingMachineContext) => availableAddresses.length !== 0

const isFirstPurchase = ({
  canEditData,
  userProfileId,
}: ShippingMachineContext) => canEditData && !userProfileId

const hasEditingAddressId = ({ editingAddressId }: ShippingMachineContext) =>
  editingAddressId != null

const shippingStateMachine = Machine<
  ShippingMachineContext,
  ShippingMachineEvents
>(
  {
    initial: 'initial',
    context: {
      availableAddresses: [],
      canEditData: true,
      selectedAddress: null,
      userProfileId: null,
      editingAddressId: null,
      hasHistory: true,
      retryAddress: null,
    },
    states: {
      initial: {
        always: [
          { target: 'createAddress', cond: hasEditingAddressId },
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
              SUBMIT_CREATE_ADDRESS: {
                target: 'submitting',
                actions: 'updateAddressContext',
              },
            },
          },
          submitting: {
            on: {
              EDIT_ADDRESS: undefined,
            },
            invoke: {
              src: 'tryToCreateAddress',
              onDone: {
                target: 'done',
                actions: [
                  'updateSelectedAddress',
                  'updateAvailableAddresses',
                  'clearRetryAddress',
                ],
              },
              onError: {
                target: 'error',
                actions: 'updateRetryAddress',
              },
            },
          },
          error: {
            on: {
              RETRY_CREATE_ADDRESS: 'submitting',
              EDIT_ADDRESS: {
                target: 'editing',
                actions: 'clearRetryAddress',
              },
            },
          },
          done: {
            entry: 'clearEditingAddressId',
            type: 'final',
          },
        },
        onDone: 'selectShippingOption',
      },
      selectAddress: {
        initial: 'idle',
        states: {
          idle: {
            always: [
              {
                target: 'createAddress',
                cond: 'hasNoAvailableAddresses',
              },
              {
                target: 'createAddress',
                cond: 'isFirstPurchase',
              },
            ],
            on: {
              GO_TO_CREATE_ADDRESS: 'createAddress',
              SUBMIT_SELECT_ADDRESS: {
                target: 'submitting',
                actions: 'updateAddressContext',
              },
            },
          },
          submitting: {
            on: {
              EDIT_ADDRESS: undefined,
            },
            invoke: {
              src: 'tryToSelectAddress',
              onDone: {
                target: 'selectOption',
                actions: ['updateSelectedAddress', 'clearRetryAddress'],
              },
              onError: {
                target: 'error',
                actions: 'updateRetryAddress',
              },
            },
          },
          error: {
            on: {
              RETRY_SELECT_ADDRESS: 'submitting',
              EDIT_ADDRESS: {
                target: 'idle',
                actions: 'clearRetryAddress',
              },
            },
          },
          createAddress: {
            type: 'final',
          },
          selectOption: {
            type: 'final',
          },
        },

        onDone: [
          {
            target: 'selectShippingOption',
            cond: (_, __, meta) =>
              meta.state.matches({ selectAddress: 'selectOption' }),
          },
          {
            target: 'createAddress',
          },
        ],
      },
      selectShippingOption: {
        initial: 'editing',
        on: {
          EDIT_ADDRESS: [
            {
              target: 'createAddress',
              cond: isFirstPurchase,
              actions: 'updateEditingAddressId',
            },
            { target: 'selectAddress' },
          ],
        },
        states: {
          idle: {
            on: {
              DESELECT_SHIPPING_OPTION: 'editing',
              GO_TO_ADDRESS_STEP: 'done',
            },
          },
          editing: {
            on: {
              SUBMIT_SELECT_SHIPPING_OPTION: 'submitting',
            },
          },
          submitting: {
            on: {
              EDIT_ADDRESS: undefined,
            },
            invoke: {
              src: 'tryToSelectShippingOption',
              onDone: 'idle',
            },
          },
          done: {
            type: 'final',
          },
        },

        onDone: 'done',
      },
      done: {
        entry: 'goToNextStep',
      },
    },
  },
  {
    actions: {
      goToNextStep: () => {},
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
      updateRetryAddress: assign((_, action) => {
        if (
          action.type !== 'error.platform.tryToCreateAddress' &&
          action.type !== 'error.platform.tryToSelectAddress'
        ) {
          return {}
        }

        return {
          retryAddress: action.data,
        }
      }),
      clearRetryAddress: assign({
        retryAddress: (_) => {
          return null
        },
      }),
      updateAvailableAddresses: assign({
        availableAddresses: (ctx, action) => {
          if (action.type !== 'done.invoke.tryToCreateAddress') {
            return ctx.availableAddresses
          }

          return action.data.orderForm.shipping.availableAddresses
        },
      }),
    },
    guards: {
      hasSelectedAddress,
      hasNoAvailableAddresses,
      hasAvailableAddresses,
      isFirstPurchase,
    },
  }
)

export default shippingStateMachine
