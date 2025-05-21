import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import type { Position } from '../../types.ts'
import type { components } from '../spec'
import { useApiClient } from '../use-api-client/use-api-client.ts'
import { characterKey } from './use-character.ts'

const useActions = (name: string | null | undefined) => {
  const queryClient = useQueryClient()
  const { client } = useApiClient()

  const doMove = useMutation({
    mutationFn: async ({ pos }: { pos: Position }) => {
      if (!name) throw new Error('Specify name before calling action')
      const { data, error } = await client.POST('/my/{name}/action/move', {
        body: pos,
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        queryClient.setQueryData([characterKey, name], data.data.character)
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
  })

  const doFight = useCallback(async () => {
    if (!name) throw new Error('Function not implemented.')
    const { data, error } = await client.POST('/my/{name}/action/fight', {
      params: {
        path: { name },
      },
    })
    if (data?.data) {
      return data.data
    }
    // @ts-ignore
    throw new Error(error?.error.message || 'unknown error')
  }, [client, name])

  const doWithdraw = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/withdraw', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doDeposit = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/deposit', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doCraft = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/crafting', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )
  const doUnEquip = useCallback(
    async ({ slot, quantity }: { slot: components['schemas']['ItemSlot']; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/unequip', {
        body: { slot, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doEquip = useCallback(
    async ({ code, slot, quantity }: { code: string; slot: components['schemas']['ItemSlot']; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/equip', {
        body: { slot, quantity, code },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doWithdrawGold = useCallback(
    async ({ quantity }: { quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/withdraw/gold', {
        body: { quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doDepositGold = useCallback(
    async ({ quantity }: { quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/deposit/gold', {
        body: { quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doTaskTrade = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/task/trade', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doBuyItem = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/npc/buy', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doSellItem = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/npc/sell', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doConsumeItem = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/use', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doRecycleItem = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/recycling', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  const doDeleteItem = useCallback(
    async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/delete', {
        body: { code, quantity },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      // @ts-ignore
      throw new Error(error?.error.message || 'unknown error')
    },
    [client, name]
  )

  return {
    doMove,
    doFight,
    doDeposit,
    doWithdraw,
    doCraft,
    doUnEquip,
    doEquip,
    doWithdrawGold,
    doDepositGold,
    doTaskTrade,
    doBuyItem,
    doSellItem,
    doConsumeItem,
    doRecycleItem,
    doDeleteItem,
  }
}

export { useActions }
