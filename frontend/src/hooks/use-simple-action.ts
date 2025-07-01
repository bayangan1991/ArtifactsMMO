import { useQueryClient } from '@tanstack/react-query'
import { Guid } from 'guid-typescript'
import type { PathsWithMethod } from 'openapi-typescript-helpers'
import { useCallback } from 'react'
import { characterKey } from '../artifactsmmo-client/hooks/use-character.ts'
import type { paths } from '../artifactsmmo-client/spec'
import { useApiClient } from '../artifactsmmo-client/use-api-client/use-api-client.ts'
import type { ActionData, Queue, QueueParams } from '../types.ts'

interface UseSimpleActionParams<T> {
  name: string | null
  label: string
  path: PathsWithMethod<paths, 'post'>
  onSuccess: (data: ActionData) => void
  onError: (error: string) => void
  queueAction: (action: Queue<T>, index?: number) => void
}

export const useSimpleAction = <T extends ActionData>({
  name,
  label,
  path,
  onSuccess,
  onError,
  queueAction,
}: UseSimpleActionParams<T>) => {
  const queryClient = useQueryClient()
  const { client } = useApiClient()
  const doAction = useCallback(async (): Promise<T | null> => {
    if (name) {
      try {
        const { data, error } = await client.POST(path, {
          params: { path: { name } },
        })
        if (data) {
          // @ts-ignore
          onSuccess(data.data as unknown as T)
          // @ts-ignore
          queryClient.setQueryData([characterKey, name], (data.data as unknown as T).character)
          // @ts-ignore
          return data.data as unknown as T
        }
        // @ts-ignore
        onError(error.error.message)
      } catch {}
    }
    return null
  }, [client, name, path, onSuccess, onError, queryClient])

  const action = useCallback(
    (params?: QueueParams) => {
      if (name) {
        const handleAction = async () => {
          const result = await doAction()
          // Special handling for gathering
          if (params?.requeue) {
            if (path === '/my/{name}/action/gathering') {
              if (result) {
                action({ queueIndex: 0, requeue: params?.requeue })
              } else {
                action({ requeue: params?.requeue })
              }
            } else if (result) {
              action(params)
            }
          }
          return result
        }

        queueAction(
          {
            label: `${params?.requeue ? 'Repeat ' : ''}${label}`,
            guid: Guid.create(),
            action: handleAction,
          },
          params?.queueIndex
        )
      }
    },
    [name, doAction, queueAction, label, path]
  )

  return action
}
