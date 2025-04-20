import { Guid } from 'guid-typescript'
import type { PathsWithMethod } from 'openapi-typescript-helpers'
import { useCallback, useContext } from 'react'
import type { ActionData, Queue } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'
import type { paths } from '../spec'

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
  const { client } = useContext(ApiClientContext)
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
          return data.data as unknown as T
        }
        // @ts-ignore
        onError(error.error.message)
      } catch {}
    }
    return null
  }, [client, name, path, onSuccess, onError])

  const action = useCallback(
    ({ queueIndex, requeue }: { queueIndex?: number; requeue?: boolean }) => {
      if (name) {
        const handleAction = async () => {
          const result = await doAction()
          // Special handling for gathering
          if (requeue) {
            if (path === '/my/{name}/action/gathering') {
              if (result) {
                action({ queueIndex: 0, requeue })
              } else {
                action({ requeue })
              }
            } else if (result) {
              action({ queueIndex, requeue })
            }
          }
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat ' : ''}${label}`,
            guid: Guid.create(),
            action: handleAction,
          },
          queueIndex
        )
      }
    },
    [name, doAction, queueAction, label, path]
  )

  return action
}
