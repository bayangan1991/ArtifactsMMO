import { useContext, useEffect, useState } from 'react'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

interface Params {
  currentPosition?: Position
  page?: number
  contentType?: components['schemas']['MapContentType']
  contentCode?: string
}

const useMaps = ({ page, currentPosition, contentType, contentCode }: Params) => {
  const { client } = useContext(ApiClientContext)
  const [maps, setMaps] = useState<components['schemas']['DataPage_MapSchema_'] | null>(null)

  useEffect(() => {
    client
      .GET('/maps', { params: { query: { page, content_type: contentType, content_code: contentCode, size: 100 } } })
      .then((result) => {
        if (result.data) setMaps(result.data)
      })
      .catch(() => setMaps(null))
  }, [client, page, contentCode, contentType])

  const { data, ...rest } = maps || {}

  return {
    data: currentPosition
      ? data?.sort(
          (a, b) =>
            euclideanDistance(currentPosition, { x: a.x, y: a.y }) -
            euclideanDistance(currentPosition, { x: b.x, y: b.y })
        )
      : data,
    ...rest,
  }
}

export { useMaps }
