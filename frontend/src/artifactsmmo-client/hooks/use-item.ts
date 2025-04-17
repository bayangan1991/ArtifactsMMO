import { useContext, useEffect, useReducer } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useItem = (code: string) => {
  const { client, getCache } = useContext(ApiClientContext)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  const cache = getCache<components['schemas']['ItemSchema']>('items')

  useEffect(() => {
    if (!Object.keys(cache).includes(code)) {
      client.GET('/items/{code}', { params: { path: { code } } }).then((result) => {
        if (result.data) {
          cache[code] = result.data.data
          forceUpdate()
        }
      })
    }
  }, [client, cache, code])

  return cache[code]
}

export { useItem }
