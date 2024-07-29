import { Action, AnyAction, AsyncThunk, Dispatch, ListenerMiddleware, MiddlewareArray, ThunkDispatch, ThunkMiddleware, Unsubscribe, UnsubscribeListener, addListener } from '@reduxjs/toolkit'
import { useEffect, useState } from 'react'
// import { store } from '../../store'
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore'
//AsyncThunkConfig has been copied from /node_modules/@reduxjs/toolkit/dist/createAsyncThunk.d.ts
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

// type AttemptActionPending<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = ReturnType<AsyncThunk<Returned, ThunkArg, ThunkApiConfig>['pending']>;
// type AttemptActionFulfilled<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = ReturnType<AsyncThunk<Returned, ThunkArg, ThunkApiConfig>['fulfilled']>;
// type AttemptActionRejected<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = ReturnType<AsyncThunk<Returned, ThunkArg, ThunkApiConfig>['rejected']>;

interface Props<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> {
  store: ToolkitStore<any, AnyAction, MiddlewareArray<[ListenerMiddleware<unknown, ThunkDispatch<unknown, unknown, AnyAction>, unknown>, ThunkMiddleware<any, AnyAction>]>>
  attempt: AsyncThunk<Returned, ThunkArg, ThunkApiConfig>
  onPending?: (action: any) => void
  // onFulfilled?: (action: PayloadAction<ReturnType<T>>, listenerApi: ListenerEffectAPI<unknown, ThunkDispatch<unknown, unknown, AnyAction>, unknown>) => void
  onFulfilled?: (action: any, listenerApi: any) => void
  onRejected?: (action: any, listenerApi: any) => void
}

export function useAttemptListener<
  Returned,
  ThunkArg,
  ThunkApiConfig extends AsyncThunkConfig,
>({
  attempt,
  store,
  onPending,
  onFulfilled,
  onRejected,
}: Props<Returned, ThunkArg, ThunkApiConfig>): boolean {
  const [pending, setPending] = useState<boolean>(false)

  useEffect(() => {
    const removeAttemptPendingListener: Unsubscribe = store.dispatch(
      addListener({
        actionCreator: attempt.pending,
        effect: (action) => {
          setPending(true)
          onPending && onPending(action)
        },
      }),
    )

    const removeAttemptErrorListener: Unsubscribe = store.dispatch(
      addListener({
        actionCreator: attempt.rejected,
        effect: (action, listenerApi) => {
          setPending(false)
          onRejected
            ? onRejected(action, listenerApi)
            : console.error(`${attempt.name} has been rejected!`)
        },
      }),
    )

    const removeAttemptSuccessListener: Unsubscribe = store.dispatch(
      addListener({
        actionCreator: attempt.fulfilled,
        effect: (action, listenerApi) => {
          setPending(false)
          onFulfilled && onFulfilled(action, listenerApi)
        },
      }),
    )

    return () => {
      removeAttemptSuccessListener()
      removeAttemptErrorListener()
      removeAttemptPendingListener()
    }
  }, [attempt])

  return pending
}
