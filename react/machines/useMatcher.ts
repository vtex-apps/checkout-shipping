import { useCallback } from 'react'
import { State, EventObject, Typestate } from 'xstate'

const useMatcher = <Context, Events extends EventObject>(
  state: State<Context, Events>
) =>
  useCallback((params: Typestate<Context>['value']) => state.matches(params), [
    state,
  ])

export default useMatcher
