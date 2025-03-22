import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useCharacters = (account?: string) => {
  const { client } = useContext(ApiClientContext)
  const [characters, setCharacters] = useState<components['schemas']['CharacterSchema'][]>([])

  useEffect(() => {
    if (account)
      client
        .GET('/accounts/{account}/characters', { params: { path: { account: account } } })
        .then(({ data: result }) => {
          if (result) {
            setCharacters(result.data)
          }
        })
  }, [client, account])

  return characters
}
export { useCharacters }
