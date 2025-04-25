import { useCallback, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useGrandExchange = () => {
  const { client } = useContext(ApiClientContext)
  const [grandExchange, setGrandExchange] = useState<components['schemas']['DataPage_GEOrderSchema_'] | null>(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const [debouncedFilter] = useDebounce(filter, 500)

  const refetch = useCallback(async () => {
    const result = await client.GET('/grandexchange/orders', {
      params: { query: { page, code: debouncedFilter || undefined } },
    })
    if (result.data) {
      setGrandExchange(result.data)
      setPages(result.data.pages || null)
    }
  }, [client, page, debouncedFilter])

  useEffect(() => {
    refetch()
  }, [refetch])

  const handleSetFilter = (filter: string) => {
    if (filter.length > 0) setFilter(filter)
    else setFilter(null)
  }
  return { grandExchange, refetch, pagination: { setPage, page, pages }, filter, setFilter: handleSetFilter }
}

export { useGrandExchange }
