import { useEffect } from 'react'

type AttemptListeners = Array<[
    string,
    {[key: string]: (...args: any[]) => void},
    (() => void)?
]> 

/**
 * This hook listens to changes in the first parameter
 * and executes corresponding functions based on the second parameter.
 * The third parameter is a fallback to handle errors.
 *
 * @param attemptsListeners - An array of attempt listeners.
 *
 * Example usage:
 *   useAttemptsListener([
 *     attemptAuthStatus, {
 *       'UNKNOWN_CREDENTIALS': () => console.log('UNKNOWN_CREDENTIALS'),
 *       'NO_ORGANISATION': () => console.log('NO_ORGANISATION'),
 *       'unknown_error': () => console.log('unknown_error'),
 *     },
 *     attemptSomethingElse, {
 *       'case 1': () => console.log('case 1'),
 *       'case 2': () => console.log('case 2'),
 *       'case 3': () => console.log('case 3'),
 *     },
 *   ]);
 */
export function useAttemptsListener(
    attemptsListeners: AttemptListeners,
    onReturn?: () => void,
    extraFunction?: () => void
){
  attemptsListeners.forEach(([attempt, listeners , onIdle = undefined]) => {
    useEffect(() => {
          Object.entries(listeners).forEach(([key, func]) => {
            if (attempt === key) {
              func()
            } //else fallback()
          })
          return () => {
            onIdle && onIdle() 
          }
    }, [attempt])
  })
  useEffect(() => {
    extraFunction && extraFunction()
    return () => {
      onReturn && onReturn() 
    }
  }, [])
}