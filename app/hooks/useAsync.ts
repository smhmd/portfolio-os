import { type DependencyList, useEffect, useState } from 'react'

type AsyncResult<T> =
  | { data?: undefined; error?: undefined; isLoading: true }
  | { data?: undefined; error: Error; isLoading: false }
  | { data: T; error?: undefined; isLoading: false }

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: DependencyList = [],
): AsyncResult<T> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setData(undefined)
    setError(undefined)

    fn()
      .then((res) => {
        if (!cancelled) {
          setData(res)
          setError(undefined)
        }
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error(String(err)))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, deps)

  if (isLoading) {
    return { isLoading: true }
  } else if (error) {
    return { error, isLoading: false }
  } else {
    return { data: data as T, isLoading: false }
  }
}
