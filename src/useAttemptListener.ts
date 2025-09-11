import {
  AsyncThunk,
  ListenerMiddlewareInstance,
  ThunkDispatch,
  UnknownAction,
  PayloadAction,
  ListenerEffectAPI
} from '@reduxjs/toolkit'

import { useEffect, useState } from 'react'

// Infer action types from AsyncThunk
type AsyncThunkPendingAction<ThunkArg> = PayloadAction<undefined, string, { arg: ThunkArg; requestId: string }>
type AsyncThunkFulfilledAction<Returned, ThunkArg> = PayloadAction<Returned, string, { arg: ThunkArg; requestId: string }>
type AsyncThunkRejectedAction<ThunkArg, RejectedValue = unknown> = PayloadAction<RejectedValue | undefined, string, { arg: ThunkArg; requestId: string; aborted: boolean; condition: boolean }, { name?: string; message?: string; code?: string; stack?: string }>
interface Props<
  Returned,
  ThunkArg,
  State = unknown,
  Dispatch extends ThunkDispatch<any, any, any> = ThunkDispatch<unknown, unknown, UnknownAction>,
  ExtraArgument = unknown,
  RejectedValue = unknown
> {
  listenerMiddleware: ListenerMiddlewareInstance<State, Dispatch, ExtraArgument>
  
  attempt: AsyncThunk<Returned, ThunkArg, { 
    state: State
    dispatch: Dispatch
    extra: ExtraArgument
    rejectValue: RejectedValue
  }>
  initialPendingState?: boolean
  onPending?: (action: AsyncThunkPendingAction<ThunkArg>) => void
  onFulfilled?: (action: AsyncThunkFulfilledAction<Returned, ThunkArg>, listenerApi: ListenerEffectAPI<State, Dispatch, ExtraArgument>) => void
  onRejected?: (action: AsyncThunkRejectedAction<ThunkArg, RejectedValue>, listenerApi: ListenerEffectAPI<State, Dispatch, ExtraArgument>) => void
}

export function useAttemptListener<
  Returned,
  ThunkArg,
  State = unknown,
  Dispatch extends ThunkDispatch<any, any, any> = ThunkDispatch<unknown, unknown, UnknownAction>,
  ExtraArgument = unknown,
  RejectedValue = unknown
>({
  attempt,
  initialPendingState = false,
  listenerMiddleware,
  onPending,
  onFulfilled,
  onRejected,

}: Props<Returned, ThunkArg, State, Dispatch, ExtraArgument, RejectedValue>): boolean {
  const [pending, setPending] = useState<boolean>(initialPendingState)

  useEffect(() => {
    const removePending = listenerMiddleware.startListening({
      actionCreator: attempt.pending,
      effect: (action) => {
        setPending(true)
        onPending?.(action)
      },
    })

    const removeRejected = listenerMiddleware.startListening({
      actionCreator: attempt.rejected,
      effect: (action, listenerApi) => {
        setPending(false)
        onRejected?.(action, listenerApi) ??
          console.error(`${attempt.typePrefix} was rejected.`)
      },
    })

    const removeFulfilled = listenerMiddleware.startListening({
      actionCreator: attempt.fulfilled,
      effect: (action, listenerApi) => {
        setPending(false)
        onFulfilled?.(action, listenerApi)
      },
    })

    return () => {
      removePending()
      removeRejected()
      removeFulfilled()
    }
  }, [attempt, listenerMiddleware, onPending, onRejected, onFulfilled])


  return pending
}
