import { Guid } from 'guid-typescript'
import { useCallback } from 'react'
import type { ActionData, Queue, QueueParams } from '../../types.ts'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type ActionType = (...[args]: any[]) => Promise<ActionData>

interface QueuableActionParams<Action extends ActionType> {
  label: string | ((params: Parameters<Action>[0] & QueueParams) => string)
  action: Action
  onSuccess: (data: ActionData) => void
  onError: (error: string) => void
  queueAction: (action: Queue<ActionData>, index?: number) => void
}

export const useQueueableAction = <Action extends ActionType>(
  hookParams: QueuableActionParams<Action>
): ((callbackParams: Parameters<Action>[0] & QueueParams) => void) => {
  const handleAction = useCallback(
    (actionParams: Parameters<Action>[0] & QueueParams) => {
      const action = async () => {
        try {
          const result = await hookParams.action(actionParams)
          if (actionParams?.requeue) handleAction(actionParams)
          hookParams.onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) hookParams.onError(err.message)
          return null
        }
      }

      hookParams.queueAction(
        {
          label: typeof hookParams.label === 'string' ? hookParams.label : hookParams.label(actionParams),
          guid: Guid.create(),
          action,
        },
        actionParams?.queueIndex
      )
    },
    [hookParams]
  )
  return handleAction
}
