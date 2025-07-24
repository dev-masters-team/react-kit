import {
  AsyncThunk,
  Dispatch,
  ListenerMiddlewareInstance,
  ThunkDispatch,
  UnknownAction
} from '@reduxjs/toolkit'

import { useEffect, useState } from 'react'

// AsyncThunkConfig has been copied from /node_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts
declare type AsyncThunkConfig = {
  state?: unknown
  dispatch?: Dispatch
  extra?: unknown
  rejectValue?: unknown
  serializedErrorType?: unknown
  pendingMeta?: unknown
  fulfilledMeta?: unknown
  rejectedMeta?: unknown
}
interface Props<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> {
  listenerMiddleware: ListenerMiddlewareInstance<unknown, ThunkDispatch<unknown, unknown, UnknownAction>, unknown>
  
  attempt: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
  onPending?: (action: any) => void
  onFulfilled?: (action: any, listenerApi: any) => void
  onRejected?: (action: any, listenerApi: any) => void
}

export function useAttemptListener<
  Returned,
  ThunkArg,
  ThunkApiConfig extends AsyncThunkConfig,
>({
  attempt,
  listenerMiddleware,
  onPending,
  onFulfilled,
  onRejected,
}: Props<Returned, ThunkArg, ThunkApiConfig>): boolean {
  const [pending, setPending] = useState<boolean>(false)

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
