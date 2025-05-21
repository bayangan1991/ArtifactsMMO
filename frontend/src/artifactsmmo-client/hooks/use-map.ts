import { useQuery } from '@tanstack/react-query'
import type { Position } from '../../types.ts'
import { useApiClient } from './use-api-client.ts'

const key = 'map'

const useMap = (pos?: Position) => {
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key, pos],
    queryFn: async () => {
      if (!pos) return
      const result = await client.GET('/maps/{x}/{y}', { params: { path: { x: pos.x, y: pos.y } } })
      return result.data?.data || null
    },
    staleTime: 600,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!pos,
  })
}

export { useMap }
