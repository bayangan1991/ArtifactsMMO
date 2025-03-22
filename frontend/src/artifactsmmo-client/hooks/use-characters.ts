import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'

const useCharacters = (account: string) => {
  const { client } = useContext(ApiClientContext)
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    client
      .GET('/accounts/{account}/characters', { params: { path: { account: account } } })
      .then(({ data: result }) => {
        if (result) {
          setCharacters(result.data.map((char) => char.name))
        }
      })
  }, [client, account])

  return characters
}
export { useCharacters }
