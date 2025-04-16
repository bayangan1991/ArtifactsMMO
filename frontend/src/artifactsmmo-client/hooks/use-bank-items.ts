import { useCallback, useContext, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useBankItems = () => {
  const { client } = useContext(ApiClientContext)
  const [bankItems, setBankItems] = useState<components['schemas']['DataPage_SimpleItemSchema_'] | null>(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const [debouncedFilter] = useDebounce(filter, 500)

  const refetch = useCallback(async () => {
    const result = await client.GET('/my/bank/items', {
      params: { query: { page, item_code: debouncedFilter || undefined } },
    })
    if (result.data) {
      setBankItems(result.data)
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
  return { bankItems, refetch, pagination: { setPage, page, pages }, filter, setFilter: handleSetFilter }
}

export { useBankItems }
