import { useCallback, useContext } from 'react'
import type { Position } from '../../types.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useActions = (name: string | null | undefined) => {
  const { client } = useContext(ApiClientContext)

  const doMove = useCallback(
    async ({ x, y }: Position) => {
      if (!name) throw new Error('Function not implemented.')
      const { data, error } = await client.POST('/my/{name}/action/move', {
        body: { x, y },
        params: {
          path: { name },
        },
      })
      if (data?.data) {
        return data.data
      }
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

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
    throw new Error(error || 'unknown error')
  }, [client, name])

  const doWithdraw = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doDeposit = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doCraft = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )
  const doUnEquip = useCallback(
    async (slot: components['schemas']['ItemSlot'], quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doEquip = useCallback(
    async (code: string, slot: components['schemas']['ItemSlot'], quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doWithdrawGold = useCallback(
    async (quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doDepositGold = useCallback(
    async (quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doTaskTrade = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doBuyItem = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doSellItem = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
    },
    [client, name]
  )

  const doConsumeItem = useCallback(
    async (code: string, quantity: number) => {
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
      throw new Error(error || 'unknown error')
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
  }
}

export { useActions }
