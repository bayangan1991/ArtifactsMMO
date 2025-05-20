import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { operations } from '../spec'

const itemsKey = 'items'

interface Params {
  filters?: operations['get_all_items_items_get']['parameters']['query']
}

const useItems = ({ filters }: Params) => {
  const { client } = useContext(ApiClientContext)

  return useQuery({
    queryKey: [itemsKey, filters],
    queryFn: async () => {
      const result = await client.GET('/items', { params: { query: filters } })
      return result.data
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  })
}

export { useItems }
