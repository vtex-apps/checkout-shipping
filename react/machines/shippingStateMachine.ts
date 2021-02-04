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
              SUBMIT_CREATE_ADDRESS: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToCreateAddress',
              onDone: {
                target: 'done',
                actions: ['updateSelectedAddress'],
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
              SUBMIT_SELECT_ADDRESS: 'submitting',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToSelectAddress',
              onDone: {
                target: 'selectOption',
                actions: 'updateSelectedAddress',
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