import { useCallback } from 'react'
import type { ActionData, Position } from '../../types.ts'
import { client } from '../client.ts'
import type { components } from '../spec'

interface Params {
  onSuccess: (data: ActionData) => void
  onError: (error: string) => void
}

const useActions = ({ onSuccess, onError }: Params) => {
  const doDeposit = useCallback(
    async (name: string, code: string, quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/bank/deposit', {
          body: { code, quantity },
          params: {
            path: { name },
          },
        })
        if (data?.data) {
          onSuccess(data.data)
          return data.data
        }
        // @ts-ignore
        onError(error?.error.message)
      } catch {}
      return null
    },
    [onSuccess, onError]
  )

  const doMove = useCallback(
    async (name: string, { x, y }: Position): Promise<null | components['schemas']['CharacterMovementDataSchema']> => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/move', {
          body: { x, y },
          params: {
            path: { name },
          },
        })
        if (data?.data) {
          onSuccess(data.data)
          return data.data
        }
        // @ts-ignore
        onError(error?.error.message)
      } catch {}
      return null
    },
    [onSuccess, onError]
  )

  const doWithdraw = useCallback(
    async (name: string, code: string, quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/bank/withdraw', {
          body: { code, quantity },
          params: {
            path: { name },
          },
        })
        if (data?.data) {
          onSuccess(data.data)
          return data.data
        }
        // @ts-ignore
        onError(error?.error.message)
      } catch {}
      return null
    },
    [onSuccess, onError]
  )

  return { doMove, doDeposit, doWithdraw }
}

export { useActions }
