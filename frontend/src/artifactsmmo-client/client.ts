import createClient, { type Middleware } from 'openapi-fetch'
import { useEffect, useState } from 'react'
import type { Position } from '../types.ts'
import type { paths } from './spec'

const client = createClient<paths>({ baseUrl: 'https://api.artifactsmmo.com/' })

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    console.log(import.meta.env)
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
        console.log(result)
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

  const move = ({ x, y }: Position) => {
    if (character)
      client
        .POST('/my/{name}/action/move', {
          body: { x, y },
          params: {
            path: { name: character },
          },
        })
        .then(({ data: moveResult }) => {
          if (moveResult) {
            setPos({ x, y })
          }
        })
  }

  return {
    pos,
    move,
  }
}

export { usePosition, useCharacters }
