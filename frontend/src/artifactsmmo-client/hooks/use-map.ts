import { useContext, useEffect, useReducer } from 'react'
import type { Position } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useMap = (pos: Position) => {
  const { client, getCache } = useContext(ApiClientContext)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  const cache = getCache<components['schemas']['MapResponseSchema']>('maps')
  const key = `${pos.x},${pos.y}`

  useEffect(() => {
    client.GET('/maps/{x}/{y}', { params: { path: pos } }).then((result) => {
      if (result.data) {
        cache[key] = result.data
        forceUpdate()
      }
    })
  }, [client, cache, pos, key])

  return cache[key]
}

export { useMap }
