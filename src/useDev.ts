import { type SelectProps } from 'rc-select/lib/Select'
import React, { useEffect, useRef } from 'react'

/**
 * example of usage: useDev('FilesPicker').reRendering()
 * @param componentName
 * @returns
 */
export function useDev(componentName: string = 'Component') {
  return {
    renderTimeMeasurement: () => useDevRenderTimeMeasurement(componentName),
    reRendering: () => useDevReRenderingConsole(componentName),
    useFakeAutocomplete: (options: string[]) => useFakeAutocomplete(options),
    delay: (ms: number = 1000) => delay(ms),
  }
}

function useDevRenderTimeMeasurement(componentName: string) {
  const start = performance.now()

  useEffect(() => {
    const end = performance.now()
    console.log(
      `${componentName} Rendering took:`,
      end - start,
      `ms ~ ${((end - start) / 1000).toFixed(2)} s`,
    )
  }, [])
}

function useDevReRenderingConsole(componentName?: string) {
  const renderCount = useRef(0)

  useEffect(() => {
    renderCount.current += 1
    console.log(`${componentName} rendered ${renderCount.current} times`)
  })
}

function useFakeAutocomplete(_options: string[]) {
  const options = _options.map((option) => ({
    value: option,
  }))
  const filterOption: SelectProps['filterOption'] = (inputValue, option) =>
    (option as { value: string })!.value
      .toUpperCase()
      .indexOf(inputValue.toUpperCase()) !== -1

  return { filterOption, options }
}

function delay(ms: number){
  return new Promise(resolve => setTimeout(resolve, ms)) 
}