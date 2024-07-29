import { useState, useEffect } from 'react'

export function useFetchData<T>(
    fetchDataFunction: () => Promise<T>,
    onError: (error: any) => void
    ) {
    const abortController = new AbortController()
    const [fetchedData, setFetchedData] = useState<T|null>()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchDataFunction()
          setFetchedData(data)
        } catch (e) {
          console.error('useFetchData error:', e)
          onError(e)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()

      return () => {
        abortController.abort()
      }
    }, [])

  return { fetchedData, isLoading }
}