import type { PathsWithMethod } from 'openapi-typescript-helpers'
import { useCallback, useEffect, useState } from 'react'
import type { Position } from '../../../types.ts'
import { client } from '../../client.ts'
import type { components, paths } from '../../spec'

const useSimpleAction = (name: string | null, action: PathsWithMethod<paths, 'post'>, refetch: () => void) => {
  return useCallback(async (): Promise<null> => {
    if (name) {
      const restResult = await client.POST(action, {
        params: { path: { name } },
      })
      if (restResult) refetch()
    }
    return null
  }, [name, action, refetch])
}

const useCharacter = (name: string | null) => {
  const [character, setCharacter] = useState<components['schemas']['CharacterSchema'] | null>(null)

  useEffect(() => {
    if (name) refetch()
  }, [name])

  const refetch = useCallback(() => {
    if (name)
      client.GET('/characters/{name}', { params: { path: { name } } }).then(({ data: result }) => {
        if (result) {
          setCharacter(result.data)
        }
      })
  }, [name])

  const move = useCallback(
    async ({ x, y }: Position): Promise<null | components['schemas']['CharacterMovementDataSchema']> => {
      if (name)
        try {
          const { data: moveResult } = await client.POST('/my/{name}/action/move', {
            body: { x, y },
            params: {
              path: { name },
            },
          })
          if (moveResult) refetch()
          return null
        } catch {
          return null
        }
      return new Promise(() => null)
    },
    [name, refetch]
  )

  const rest = useSimpleAction(name, '/my/{name}/action/rest', refetch)
  const fight = useSimpleAction(name, '/my/{name}/action/fight', refetch)
  const gathering = useSimpleAction(name, '/my/{name}/action/gathering', refetch)

  return {
    character,
    refetch,
    actions: { move, rest, fight, gathering },
  }
}
export { useCharacter }
