import { Machine } from 'xstate'

import type { AddressMachineEvents } from './types'

const addressStateMachine = Machine<unknown, AddressMachineEvents>(
  {
    initial: 'editAddress',
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
            },
          },
          submitting: {
            invoke: {
              src: 'tryToUpdateCompleteAddress',
              onDone: [
                {
                  target: 'updateComplete',
                  actions: 'updateSelectedAddress',
                },
              ],
              onError: 'editing',
            },
          },
          updateComplete: {
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
    },
  }
)

export default addressStateMachine
