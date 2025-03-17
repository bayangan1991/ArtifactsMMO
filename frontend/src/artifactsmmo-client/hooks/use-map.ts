import { useEffect, useState } from 'react'
import type { Position } from '../../types.ts'
import { client } from '../client.ts'
import type { components } from '../spec'

const useMap = (pos: Position) => {
  const [map, setMap] = useState<components['schemas']['MapResponseSchema'] | null>(null)

  useEffect(() => {
    client
      .GET('/maps/{x}/{y}', { params: { path: pos } })
      .then((result) => {
        if (result.data) setMap(result.data)
      })
      .catch(() => setMap(null))
  }, [pos])

  return map
}

export { useMap }
