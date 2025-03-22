import { useContext, useEffect, useState } from 'react'
import type { Position } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useMap = (pos: Position) => {
  const { client } = useContext(ApiClientContext)
  const [map, setMap] = useState<components['schemas']['MapResponseSchema'] | null>(null)

  useEffect(() => {
    client
      .GET('/maps/{x}/{y}', { params: { path: pos } })
      .then((result) => {
        if (result.data) setMap(result.data)
      })
      .catch(() => setMap(null))
  }, [client, pos])

  return map
}

export { useMap }
