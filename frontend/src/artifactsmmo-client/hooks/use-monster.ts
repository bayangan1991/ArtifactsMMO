import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useMonster = (code: string) => {
  const { client } = useContext(ApiClientContext)
  const [monster, setMonster] = useState<components['schemas']['MonsterSchema'] | null>(null)

  useEffect(() => {
    client
      .GET('/monsters/{code}', { params: { path: { code } } })
      .then((result) => {
        if (result.data) {
          setMonster(result.data.data)
        } else {
          setMonster(null)
        }
      })
      .catch(() => setMonster(null))
  }, [client, code])

  return monster
}

export { useMonster }
