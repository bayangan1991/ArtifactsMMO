import { useEffect, useState } from 'react'
import { client } from '../client.ts'

const useCharacters = (account: string) => {
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    client
      .GET('/accounts/{account}/characters', { params: { path: { account: account } } })
      .then(({ data: result }) => {
        if (result) {
          setCharacters(result.data.map((char) => char.name))
        }
      })
  }, [account])

  return characters
}
export { useCharacters }
