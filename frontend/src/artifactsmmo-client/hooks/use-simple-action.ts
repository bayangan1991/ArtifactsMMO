import { Guid } from 'guid-typescript'
import type { PathsWithMethod } from 'openapi-typescript-helpers'
import { useCallback, useContext } from 'react'
import type { ActionData, Queue } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'
import type { paths } from '../spec'

interface UseSimpleActionParams<T> {
  name: string | null
  label: string
  action: PathsWithMethod<paths, 'post'>
  onSuccess: (data: ActionData) => void
  onError: (error: string) => void
  queueAction: (action: Queue<T>, force?: boolean, index?: number) => void
}

export const useSimpleAction = <T extends ActionData>({
  name,
  label,
  action,
  onSuccess,
  onError,
  queueAction,
}: UseSimpleActionParams<T>) => {
  const { client } = useContext(ApiClientContext)
  const doAction = useCallback(async (): Promise<T | null> => {
    if (name) {
      try {
        const result = await client.POST(action, {
          params: { path: { name } },
        })
        if (result?.data) {
          // @ts-ignore
          onSuccess(result.data.data as unknown as T)
          // @ts-ignore
          return result.data.data as unknown as T
        }
        // @ts-ignore
        onError(result.error.error.message)
      } catch {}
    }
    return null
  }, [client, name, action, onSuccess, onError])

  const repeat = async () => {
    const guid = Guid.create()
    const requeueIfSuccess = async () => {
      const result = await doAction()

      if (action === '/my/{name}/action/gathering') {
        if (result) {
          queueAction({ label: `Repeat ${label}`, guid, action: requeueIfSuccess }, true, 0)
        } else {
          queueAction({ label: `Repeat ${label}`, guid, action: requeueIfSuccess }, true)
        }
      } else {
        if (result) {
          queueAction({ label: `Repeat ${label}`, guid, action: requeueIfSuccess }, true)
        }
      }
      return result
    }

    return queueAction({ label: `Repeat ${label}`, guid, action: requeueIfSuccess })
  }

  return [
    useCallback(
      async () => queueAction({ label, guid: Guid.create(), action: doAction }),
      [doAction, label, queueAction]
    ),
    repeat,
  ]
}
