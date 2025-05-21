import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useApiClient } from './use-api-client.ts'

const key = 'grandExchange'

const useGrandExchange = () => {
  const { client } = useApiClient()
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const [debouncedFilter] = useDebounce(filter, 500)

  const handleSetFilter = (filter: string) => {
    if (filter.length > 0) setFilter(filter)
    else setFilter(null)
  }

  const query = useQuery({
    queryKey: [key, { page, debouncedFilter }],
    queryFn: async () => {
      const result = await client.GET('/grandexchange/orders', {
        params: { query: { page, code: debouncedFilter || undefined } },
      })
      return result.data || null
    },
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPages(query.data?.pages || null)
  }, [query.data?.pages])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Reset page when filter changes
  useEffect(() => {
    setPage(1)
  }, [debouncedFilter])

  return { query, pagination: { setPage, page, pages }, filter, setFilter: handleSetFilter }
}

export { useGrandExchange }
