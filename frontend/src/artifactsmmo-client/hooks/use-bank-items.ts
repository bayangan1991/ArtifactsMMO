import { useCallback, useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useBankItems = () => {
  const { client } = useContext(ApiClientContext)
  const [bankItems, setBankItems] = useState<components['schemas']['DataPage_SimpleItemSchema_'] | null>(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)

  const refetch = useCallback(async () => {
    const result = await client.GET('/my/bank/items', { params: { query: { page } } })
    if (result.data) {
      setBankItems(result.data)
      setPages(result.data.pages || null)
    }
  }, [client, page])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { bankItems, refetch, pagination: { setPage, page, pages } }
}

export { useBankItems }
