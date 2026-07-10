import { useMemo, useState } from 'react'

import { matchSorter } from 'match-sorter'

export function useFuzzySearch<T extends string>(items: T[]) {
  const [query, setQuery] = useState('')

  const filter = useMemo(() => {
    if (query) return matchSorter(items, query)
    return items
  }, [items, query])

  return {
    query,
    setQuery,
    filter,
  }
}
