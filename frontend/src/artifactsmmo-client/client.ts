import createClient, { type Middleware } from 'openapi-fetch'
import { useEffect, useState } from 'react'
import type { Position } from '../types.ts'
import type { components, paths } from './spec'

const client = createClient<paths>({ baseUrl: 'https://api.artifactsmmo.com/' })

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_TOKEN}`)
    return request
  },
}

client.use(authMiddleware)

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

const usePosition = (character: string | null) => {
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 })

  useEffect(() => {
    if (character)
      client.GET('/characters/{name}', { params: { path: { name: character } } }).then(({ data: result }) => {
        if (result) {
          setPos({ x: result.data.x, y: result.data.y })
        }
      })
  }, [character])

  const move = ({ x, y }: Position): Promise<null | components['schemas']['CharacterMovementDataSchema']> => {
    if (character)
      return client
        .POST('/my/{name}/action/move', {
          body: { x, y },
          params: {
            path: { name: character },
          },
        })
        .then(({ data: moveResult }) => {
          if (moveResult) {
            setPos({ x, y })
            return moveResult.data
          }
          return null
        })
        .catch(() => null)
    return new Promise(() => null)
  }

  return {
    pos,
    move,
  }
}

export { usePosition, useCharacters }
