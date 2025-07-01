import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Position } from '../../types.ts'
import type { components } from '../spec'
import { useApiClient } from '../use-api-client/use-api-client.ts'
import { characterKey } from './use-character.ts'

const useActions = (name?: string | null) => {
  const queryClient = useQueryClient()
  const { client } = useApiClient()

  const doMove = useMutation({
    mutationFn: async ({ pos }: { pos: Position }) => {
      if (!name) throw new Error('Function not implemented.')
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

  const doFight = useMutation({
    mutationFn: async () => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/fight', {
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

  const doWithdraw = useMutation({
    mutationFn: async ({ items }: { items: { code: string; quantity: number }[] }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/withdraw/item', {
        body: items,
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

  const doDeposit = useMutation({
    mutationFn: async ({ items }: { items: { code: string; quantity: number }[] }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/deposit/item', {
        body: items,
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

  const doCraft = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/crafting', {
        body: { code, quantity },
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

  const doUnEquip = useMutation({
    mutationFn: async ({ slot, quantity }: { slot: components['schemas']['ItemSlot']; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/unequip', {
        body: { slot, quantity },
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

  const doEquip = useMutation({
    mutationFn: async ({
      code,
      slot,
      quantity,
    }: { code: string; slot: components['schemas']['ItemSlot']; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/equip', {
        body: { slot, quantity, code },
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

  const doWithdrawGold = useMutation({
    mutationFn: async ({ quantity }: { quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/withdraw/gold', {
        body: { quantity },
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

  const doDepositGold = useMutation({
    mutationFn: async ({ quantity }: { quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/bank/deposit/gold', {
        body: { quantity },
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

  const doTaskTrade = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/task/trade', {
        body: { code, quantity },
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

  const doBuyItem = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/npc/buy', {
        body: { code, quantity },
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

  const doSellItem = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/npc/sell', {
        body: { code, quantity },
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

  const doConsumeItem = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/use', {
        body: { code, quantity },
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

  const doRecycleItem = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/recycling', {
        body: { code, quantity },
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

  const doDeleteItem = useMutation({
    mutationFn: async ({ code, quantity }: { code: string; quantity: number }) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/delete', {
        body: { code, quantity },
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
