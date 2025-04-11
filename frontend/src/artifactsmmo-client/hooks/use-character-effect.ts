import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useCharacterEffect = (code: string) => {
  const { client } = useContext(ApiClientContext)
  const [effect, setEffect] = useState<components['schemas']['EffectSchema'] | null>(null)

  useEffect(() => {
    client
      .GET('/effects/{code}', { params: { path: { code } } })
      .then((result) => {
        if (result.data) {
          setEffect(result.data.data)
        } else {
          setEffect(null)
        }
      })
      .catch(() => setEffect(null))
  }, [client, code])

  return effect
}

export { useCharacterEffect }
