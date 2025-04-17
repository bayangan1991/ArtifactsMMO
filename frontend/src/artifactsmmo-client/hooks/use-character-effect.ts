import { useContext, useEffect, useReducer } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useCharacterEffect = (code: string) => {
  const { client, getCache } = useContext(ApiClientContext)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  const cache = getCache<components['schemas']['EffectSchema']>('effects')

  useEffect(() => {
    client.GET('/effects/{code}', { params: { path: { code } } }).then((result) => {
      if (result.data) {
        cache[code] = result.data.data
        forceUpdate()
      }
    })
  }, [client, cache, code])

  return cache[code]
}

export { useCharacterEffect }
