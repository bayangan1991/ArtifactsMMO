import { useContext, useEffect, useReducer } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useResource = (code: string) => {
  const { client, getCache } = useContext(ApiClientContext)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  const cache = getCache<components['schemas']['ResourceSchema']>('resources')

  useEffect(() => {
    client.GET('/resources/{code}', { params: { path: { code } } }).then((result) => {
      if (result.data) {
        cache[code] = result.data.data
        forceUpdate()
      }
    })
  }, [client, code, cache])

  return cache[code]
}

export { useResource }
