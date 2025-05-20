import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { operations } from '../spec'

const itemsKey = 'items'

interface Params {
  filters?: Omit<operations['get_all_items_items_get']['parameters']['query'], 'page'>
}

const useItems = ({ filters }: Params) => {
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const { client } = useContext(ApiClientContext)

  const query = useQuery({
    queryKey: [itemsKey, { ...filters, page }],
    queryFn: async () => {
      const result = await client.GET('/items', { params: { query: { ...filters, page } } })
      setPages(result.data?.pages || null)
      return result.data
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
  return { query, pagination: { page, setPage, pages } }
}

export { useItems }
