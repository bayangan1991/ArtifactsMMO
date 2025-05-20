import { useQuery } from '@tanstack/react-query'
import { useContext, useState } from 'react'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { ApiClientContext } from '../client/context.ts'
import type { operations } from '../spec'

const key = 'maps'

interface Params {
  filters: Omit<operations['get_all_maps_maps_get']['parameters']['query'], 'page'>
  currentPosition?: Position
}

const useMaps = ({ currentPosition, filters }: Params) => {
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)
  const { client } = useContext(ApiClientContext)

  const query = useQuery({
    queryKey: [key, { ...filters, currentPosition, page }],
    queryFn: async () => {
      const result = await client.GET('/maps', { params: { query: { page, ...filters } } })
      setPages(result.data?.pages || null)
      if (!result.data) return
      if (!currentPosition) return result.data
      const { data, ...rest } = result.data

      return {
        ...rest,
        data: data.sort(
          (a, b) =>
            euclideanDistance(currentPosition, { x: a.x, y: a.y }) -
            euclideanDistance(currentPosition, { x: b.x, y: b.y })
        ),
      }
    },
  })

  return { query, pagination: { page, pages, setPage } }
}

export { useMaps }
