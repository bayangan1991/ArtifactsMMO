import { useEffect, useState } from 'react'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { client } from '../client.ts'
import type { components } from '../spec'

interface Params {
  currentPosition?: Position
  page?: number
  contentType?: components['schemas']['MapContentType']
  contentCode?: string
}

const useMaps = ({ page, currentPosition, contentType, contentCode }: Params) => {
  const [maps, setMaps] = useState<components['schemas']['DataPage_MapSchema_'] | null>(null)

  useEffect(() => {
    client
      .GET('/maps', { params: { query: { page, content_type: contentType, content_code: contentCode } } })
      .then((result) => {
        if (result.data) setMaps(result.data)
      })
      .catch(() => setMaps(null))
  }, [page, contentCode, contentType])

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
