import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { operations } from '../spec'
import { itemKey } from './use-item.ts'

const key = 'items'

interface Params {
  filters?: Omit<operations['get_all_items_items_get']['parameters']['query'], 'page'>
}

const useItems = ({ filters }: Params) => {
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const { client } = useContext(ApiClientContext)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: [key, { ...filters, page }],
    queryFn: async () => {
      const result = await client.GET('/items', { params: { query: { ...filters, page } } })

      if (result.data?.data) {
        for (const item of result.data.data) {
          queryClient.setQueryData([itemKey, item.code], item)
        }
      }
      return result.data
    },
    placeholderData: keepPreviousData,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })

  useEffect(() => {
    setPages(query.data?.pages || null)
  }, [query.data?.pages])

  const values = Object.values(filters || {})
  useEffect(() => {
    setPage(1)
  }, [...values])

  return { query, pagination: { page, setPage, pages } }
}

export { useItems }
