import { useEffect, useState, useRef, type Dispatch, type SetStateAction } from 'react'

export function useStateWithPrevious<T>(
  initialState: T,
): [T, T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initialState)
  const prevCountRef = useRef<T>(state)

  useEffect(() => {
    prevCountRef.current = state
  }, [state])

  return [state, prevCountRef.current, setState]
}
