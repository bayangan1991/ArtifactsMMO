import { useEffect, useState } from 'react'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import type { components } from '../spec'
import { useApiClient } from '../use-api-client/use-api-client.ts'

interface Params {
  currentPosition?: Position
  page?: number
}

const useEvents = (params?: Params) => {
  const { client } = useApiClient()
  const [events, setEvents] = useState<components['schemas']['DataPage_ActiveEventSchema_'] | null>(null)

  useEffect(() => {
    client
      .GET('/events/active', {
        params: { query: { page: params?.page, size: 100 } },
      })
      .then((result) => {
        if (result.data) setEvents(result.data)
      })
      .catch(() => setEvents(null))
  }, [client, params?.page])

  const { data, ...rest } = events || {}

  if (data && params?.currentPosition) {
    const currentPosition = params.currentPosition
    data.sort(
      (a, b) =>
        euclideanDistance(currentPosition, { x: a.map.x, y: a.map.y }) -
        euclideanDistance(currentPosition, { x: b.map.x, y: b.map.y })
    )
  }

  return { data, ...rest }
}

export { useEvents }
