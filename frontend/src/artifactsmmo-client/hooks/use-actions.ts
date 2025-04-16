import { useCallback, useContext } from 'react'
import type { ActionData, Position } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

interface Params {
  onSuccess: (data: ActionData) => void
  onError: (error: string) => void
}

const useActions = ({ onSuccess, onError }: Params) => {
  const { client } = useContext(ApiClientContext)

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
    [client, onSuccess, onError]
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
    [client, onSuccess, onError]
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
    [client, onSuccess, onError]
  )

  const doCraft = useCallback(
    async (name: string, code: string, quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/crafting', {
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
    [client, onSuccess, onError]
  )

  const doUnEquip = useCallback(
    async (name: string, slot: components['schemas']['ItemSlot'], quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/unequip', {
          body: { slot, quantity },
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
    [client, onSuccess, onError]
  )

  const doEquip = useCallback(
    async (name: string, code: string, slot: components['schemas']['ItemSlot'], quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/equip', {
          body: { slot, quantity, code },
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
    [client, onSuccess, onError]
  )

  const doWithdrawGold = useCallback(
    async (name: string, quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/bank/withdraw/gold', {
          body: { quantity },
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
    [client, onSuccess, onError]
  )

  const doDepositGold = useCallback(
    async (name: string, quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/bank/deposit/gold', {
          body: { quantity },
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
    [client, onSuccess, onError]
  )

  const doTaskTrade = useCallback(
    async (name: string, code: string, quantity: number) => {
      try {
        const { data, error } = await client.POST('/my/{name}/action/task/trade', {
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
    [client, onSuccess, onError]
  )

  return { doMove, doDeposit, doWithdraw, doCraft, doUnEquip, doEquip, doWithdrawGold, doDepositGold, doTaskTrade }
}

export { useActions }
