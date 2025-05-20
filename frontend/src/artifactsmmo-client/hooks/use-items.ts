import { useQuery } from '@tanstack/react-query'
import { useClient } from '../client/hooks.ts'
import type { operations } from '../spec'

const itemsKey = 'items'

interface Params {
  filters?: operations['get_all_items_items_get']['parameters']['query']
}

const useItems = ({ filters }: Params) => {
  const { client } = useClient()

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
