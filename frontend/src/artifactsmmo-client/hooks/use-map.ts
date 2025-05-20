import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import type { Position } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'

const mapKey = 'map'

const useMap = (pos?: Position) => {
  const { client } = useContext(ApiClientContext)

  return useQuery({
    queryKey: [mapKey, pos],
    queryFn: async () => {
      if (!pos) return
      const result = await client.GET('/maps/{x}/{y}', { params: { path: { x: pos.x, y: pos.y } } })
      return result.data?.data
    },
    staleTime: 600,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!pos,
  })
}

export { useMap }
