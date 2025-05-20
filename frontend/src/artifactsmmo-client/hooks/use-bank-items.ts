import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { ApiClientContext } from '../client/context.ts'

const key = 'bankItems'

const useBankItems = () => {
  const { client } = useContext(ApiClientContext)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const [debouncedFilter] = useDebounce(filter, 500)

  const handleSetFilter = (filter: string) => {
    if (filter.length > 0) setFilter(filter)
    else setFilter(null)
  }

  const query = useQuery({
    queryKey: [key],
    queryFn: async () => {
      const result = await client.GET('/my/bank/items', {
        params: { query: { page, item_code: debouncedFilter || undefined } },
      })

      setPages(result.data?.pages || null)

      return result.data
    },
  })
  return { query, pagination: { setPage, page, pages }, filter, setFilter: handleSetFilter }
}

export { useBankItems }
