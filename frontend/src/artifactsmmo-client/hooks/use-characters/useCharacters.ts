import { useEffect, useState } from 'react'
import { client } from '../../client.ts'

const useCharacters = () => {
  const [characters, setCharacters] = useState<string[]>([])

  useEffect(() => {
    client.GET('/my/characters').then(({ data: result }) => {
      if (result) {
        setCharacters(result.data.map((char) => char.name))
      }
    })
  }, [])

  return characters
}
export { useCharacters }
