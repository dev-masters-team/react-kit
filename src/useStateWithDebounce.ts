import {
  useEffect,
  useState,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from 'react'

export function useStateWithDebounce<T>(
  val: T,
  onDebounced: (e: T) => void,
  milliSeconds = 100,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(val)

  const memoizedOnDebounced = useCallback(onDebounced, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      // if (val !== value)
      // to avoid initial call onDebounced
      memoizedOnDebounced(value)
    }, milliSeconds)

    return () => {
      clearTimeout(handler)
    }
  }, [value, milliSeconds, memoizedOnDebounced])

  return [value, setValue]
}
