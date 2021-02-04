import { Machine } from 'xstate'

import type { AddressMachineContext, AddressMachineEvents } from './types'

const addressStateMachine = Machine<
  AddressMachineContext,
  AddressMachineEvents
>(
  {
    initial: 'editAddress',
    context: {
      selectedAddress: null,
      canEditData: true,
    },
    states: {
      editAddress: {
        initial: 'editing',
        states: {
          editing: {
            on: {
              SUBMIT_EDIT_ADDRESS: 'submitting',
              RESET_ADDRESS: {
                actions: 'goToCreateAddress',
              },
              EDIT_RECEIVER_INFO: 'editReceiver',
            },
          },
          submitting: {
            invoke: {
              src: 'tryToUpdateCompleteAddress',
              onDone: [
                {
                  target: 'updateComplete',
                  actions: 'updateSelectedAddress',
                  cond: ({ selectedAddress, canEditData }, event) => {
                    if (
                      event.type === 'done.invoke.tryToUpdateCompleteAddress'
                    ) {
                      return (
                        event.data.buyerIsReceiver &&
                        (!selectedAddress?.isDisposable || canEditData)
                      )
                    }

                    return !selectedAddress?.isDisposable
                  },
                },
                {
                  target: 'editReceiver',
                  actions: 'updateSelectedAddress',
                  meta: { teste: 'teste' },
                },
              ],
            },
          },
          updateComplete: {
            type: 'final',
          },
          editReceiver: {
            type: 'final',
          },
        },

        onDone: [
          {
            target: 'editReceiverInfo',
            cond: (_, __, meta) => {
              return meta.state.matches({ editAddress: 'editReceiver' })
            },
          },
          {
            target: 'done',
          },
        ],
      },
      editReceiverInfo: {
        initial: 'editing',
        on: {
          EDIT_ADDRESS: 'editAddress',
        },
        states: {
          editing: {
            on: {
              SUBMIT_RECEIVER_INFO: 'submitting',
            },
          },
          submitting: {
            on: {
              EDIT_ADDRESS: undefined,
            },
            invoke: {
              src: 'tryToEditReceiverInfo',
              onDone: {
                target: 'done',
                actions: 'updateSelectedAddress',
              },
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
      goToPreviousStep: () => {},
    },
  }
)

export default addressStateMachine
