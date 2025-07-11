import { Temporal } from '@js-temporal/polyfill'
import { Guid } from 'guid-typescript'
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { useActions } from '../artifactsmmo-client/hooks/use-actions.ts'
import { useCharacter } from '../artifactsmmo-client/hooks/use-character.ts'
import { useStatus } from '../artifactsmmo-client/hooks/use-status.ts'
import type { components } from '../artifactsmmo-client/spec'
import type { ActionData, Position, Queue, QueueParams } from '../types.ts'
import { Stack } from '../utils/stack.ts'
import { useInterval } from './use-interval.ts'
import { useQueueableAction } from './use-queuable-action.ts'
import { useSimpleAction } from './use-simple-action.ts'

enum Status {
  Ready = 'ready', // Ready to do the next action
  Paused = 'paused', // Allow use to queue up actions and resume
  Waiting = 'waiting', // Waiting for API response
  Cooldown = 'cooldown', // Currently in cooldown
}

const useCharacterActionsContext = (name: string | null) => {
  const {
    data: { timeDiff },
  } = useStatus()
  const [actionQueue] = useState<Stack<Queue<ActionData>>>(new Stack())
  const [doNextAction, setDoNextAction] = useState<boolean>(false)
  const [lastAction, setLastAction] = useState<ActionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const [cooldownExpiration, setCooldownExpiration] = useState<Temporal.Duration | null>(null)
  const [status, setStatus] = useState<Status>(Status.Ready)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  // Character Data
  const { data: character, refetch } = useCharacter({ name })

  // State management

  // Check if ready
  const checkReady = useCallback(() => {
    if (character?.cooldown_expiration) {
      const newCooldown = Temporal.Instant.from(character.cooldown_expiration).add(timeDiff)
      setCooldown(newCooldown)
      const ready = Temporal.Instant.compare(Temporal.Now.instant(), newCooldown) > -1
      setStatus((currentStatus) => {
        if (ready) {
          if ([Status.Paused, Status.Waiting].includes(currentStatus)) return currentStatus
          return Status.Ready
        }
        return Status.Cooldown
      })
    }
  }, [character, timeDiff])
  useInterval(checkReady, 1000)

  // Update timeUntilReady
  const onTick = useCallback(() => {
    const ready = Temporal.Instant.compare(Temporal.Now.instant(), cooldown) > -1
    if (ready) {
      setCooldownExpiration(null)
    } else {
      setCooldownExpiration(Temporal.Now.instant().until(cooldown))
      setStatus(Status.Cooldown)
    }
  }, [cooldown])
  useInterval(onTick, 100 as const)

  const togglePause = useCallback(
    () =>
      setStatus((currentStatus) => {
        if (currentStatus === Status.Ready) return Status.Paused
        if (currentStatus === Status.Paused) return Status.Ready
        return currentStatus
      }),
    []
  )
  // Set status to ready
  // We don't do this above as we want to guarantee state
  const pollCooldown = useCallback(async () => {
    if (cooldownExpiration === null && status === Status.Cooldown) {
      await refetch()
    }
  }, [cooldownExpiration, refetch, status])
  useInterval(pollCooldown, 5000)

  // Log the next action to be run
  const pollQueue = useCallback(
    () =>
      setStatus((currentStatus) => {
        if (currentStatus === Status.Ready) {
          if (actionQueue.size() > 0) {
            setDoNextAction(true)
            return Status.Waiting
          }
        }
        return currentStatus
      }),
    [actionQueue]
  )
  useInterval(pollQueue, 2000 as const)

  // Run action when set
  useEffect(() => {
    if (doNextAction && status === Status.Waiting) {
      try {
        actionQueue.pop()?.action()
      } catch (err) {
        console.log(err)
        setStatus(Status.Ready)
      } finally {
        setDoNextAction(false)
      }
    }
  }, [doNextAction, status, actionQueue.pop])

  // Defined Actions

  const queueAction = useCallback(
    (queue: Queue<ActionData>, index?: number) => {
      forceUpdate()
      if (index !== undefined) {
        actionQueue.insert(queue, index)
      } else {
        actionQueue.push(queue)
      }
    },
    [actionQueue]
  )

  const onSuccess = useCallback((data: ActionData) => {
    setStatus(Status.Cooldown)
    setCooldown(Temporal.Instant.from(data.cooldown.expiration))
    setLastAction(data)
    setError(null)
  }, [])

  const onError = useCallback((error: string) => {
    setLastAction(null)
    setError(error)
    setStatus(Status.Ready)
  }, [])

  const {
    doMove,
    doFight,
    doDeposit,
    doWithdraw,
    doCraft,
    doUnEquip,
    doEquip,
    doDepositGold,
    doWithdrawGold,
    doTaskTrade,
    doBuyItem,
    doSellItem,
    doConsumeItem,
    doRecycleItem,
    doDeleteItem,
  } = useActions(name)

  const move = useQueueableAction({
    label: ({ pos, requeue }) => `${requeue ? 'Repeat m' : 'M'}ove to ${pos.x},${pos.y}`,
    action: doMove.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const deposit = useQueueableAction({
    label: ({ items, requeue }) => `${requeue ? 'Repeat d' : 'D'}eposit ${items.length} items`,
    action: doDeposit.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const withdraw = useQueueableAction({
    label: ({ items, requeue }) => `${requeue ? 'Repeat w' : 'W'}ithdraw ${items.length} items`,
    action: doWithdraw.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const craft = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat c' : 'C'}raft ${quantity} x ${code}`,
    action: doCraft.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const unEquip = useQueueableAction({
    label: ({ slot, quantity, requeue }) => `${requeue ? 'Repeat u' : 'U'}nequip ${quantity} x ${slot}`,
    action: doUnEquip.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const equip = useQueueableAction({
    label: ({ code, slot, quantity, requeue }) =>
      `${requeue ? 'Repeat e' : 'E'}quip ${quantity} x ${code} into ${slot}`,
    action: doEquip.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const depositGold = useQueueableAction({
    label: ({ quantity, requeue }) => `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x gold`,
    action: doDepositGold.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const withdrawGold = useQueueableAction({
    label: ({ quantity, requeue }) => `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x gold`,
    action: doWithdrawGold.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const taskTrade = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat t' : 'T'}rade ${quantity} x ${code} to task master`,
    action: doTaskTrade.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const buyItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat b' : 'B'}uy ${quantity} x ${code}`,
    action: doBuyItem.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const sellItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat s' : 'S'}ell ${quantity} x ${code}`,
    action: doSellItem.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const recycleItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat r' : 'R'}ecycle ${quantity} x ${code}`,
    action: doRecycleItem.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const deleteItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat d' : 'D'}elete ${quantity} x ${code}`,
    action: doDeleteItem.mutateAsync,
    onSuccess,
    onError,
    queueAction,
  })

  const rest = useSimpleAction({
    name,
    label: 'Rest',
    path: '/my/{name}/action/rest',
    onSuccess,
    onError,
    queueAction,
  })
  const gathering = useSimpleAction({
    name: name,
    label: 'Gathering',
    path: '/my/{name}/action/gathering',
    onSuccess,
    onError,
    queueAction,
  })
  const buyExpansion = useSimpleAction({
    name: name,
    label: 'Buy bank expansion',
    path: '/my/{name}/action/bank/buy_expansion',
    onSuccess,
    onError,
    queueAction,
  })
  const taskAccept = useSimpleAction({
    name: name,
    label: 'Accept a new task',
    path: '/my/{name}/action/task/new',
    onSuccess,
    onError,
    queueAction,
  })
  const taskComplete = useSimpleAction({
    name: name,
    label: 'Complete current task',
    path: '/my/{name}/action/task/complete',
    onSuccess,
    onError,
    queueAction,
  })
  const taskExchange = useSimpleAction({
    name: name,
    label: 'Exchange 6x task coins for reward',
    path: '/my/{name}/action/task/exchange',
    onSuccess,
    onError,
    queueAction,
  })
  const taskAbandon = useSimpleAction({
    name: name,
    label: 'Abandon current task',
    path: '/my/{name}/action/task/cancel',
    onSuccess,
    onError,
    queueAction,
  })

  // Smart Action

  const fight = useCallback(
    (params?: QueueParams) => {
      const action = async () => {
        const before = await refetch()
        try {
          const result = await doFight.mutateAsync()
          const hpLost = (before.data?.hp || 0) - result.character.hp
          if (params?.requeue) {
            if (result.character.hp - hpLost * 1.5 > 0) {
              fight({ queueIndex: 0, requeue: params?.requeue })
            } else {
              fight({ requeue: params?.requeue })
            }
          }
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          if (params?.requeue) fight({ requeue: params?.requeue })
          return null
        }
      }

      queueAction(
        { label: `${params?.requeue ? 'Repeat f' : 'F'}ight`, guid: Guid.create(), action },
        params?.queueIndex
      )
    },
    [doFight, queueAction, refetch, onError, onSuccess]
  )

  const consumeItem = useCallback(
    ({
      item,
      quantity,
      queueIndex,
      requeue,
    }: { item: components['schemas']['ItemSchema']; quantity: number } & QueueParams) => {
      const action = async () => {
        let result: Awaited<ReturnType<typeof doConsumeItem.mutateAsync>> | null
        let toConsume = quantity
        if (item.effects?.some((effect) => effect.code === 'heal')) {
          const current = await refetch()
          if (current.data) {
            const missingHp = current.data.max_hp - current.data.hp
            const fullHealQuantity = Math.ceil(missingHp / item.effects[0].value)
            toConsume = Math.min(quantity, fullHealQuantity)
            try {
              result = await doConsumeItem.mutateAsync({ code: item.code, quantity: toConsume })
            } catch (err) {
              if (err instanceof Error && err.message) onError(err.message)
              return null
            }
          } else {
            return null
          }
        } else {
          try {
            result = await doConsumeItem.mutateAsync({ code: item.code, quantity: quantity })
          } catch (err) {
            if (err instanceof Error && err.message) onError(err.message)
            return null
          }
        }
        if (requeue && quantity - toConsume > 0)
          consumeItem({ item, quantity: quantity - toConsume, queueIndex, requeue })
        onSuccess(result)
        return result
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat c' : 'C'}onsume ${item.name}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doConsumeItem, queueAction, refetch, onError, onSuccess]
  )

  const smartCraft = useCallback(
    ({
      item,
      workshop,
      quantity,
      requeue,
      queueIndex,
    }: { item: components['schemas']['ItemSchema']; workshop: Position; quantity?: number } & QueueParams) => {
      const handleSmartCraft = async () => {
        if (!item.craft || !item?.craft.items) return null
        const itemCount = item.craft.items.reduce((count, component) => count + component.quantity, 0)
        const data = await refetch()
        if (!itemCount || !data.data) return null
        const craftAmount = quantity || Math.floor(data.data.inventory_max_items / itemCount)
        const toWithdraw = item.craft.items.map((component) => ({
          code: component.code,
          quantity: component.quantity * craftAmount,
        }))
        craft({ code: item.code, quantity: craftAmount, queueIndex: 0 })
        move({ pos: workshop, queueIndex: 0 })
        withdraw({ items: toWithdraw, queueIndex: 0 })
        if (requeue) smartCraft({ item, workshop, quantity, requeue })
        setStatus(Status.Cooldown)
        return null
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat s' : 'S'}mart craft of ${quantity ? `${quantity} x ` : ''} ${item.name} @ ${workshop.x},${workshop.y}`,
          guid: Guid.create(),
          action: handleSmartCraft,
        },
        queueIndex
      )
    },
    [craft, move, withdraw, refetch, queueAction]
  )

  const depositAll = useCallback(
    ({
      pos,
      returnToPos = false,
      ifFull = false,
      requeue,
      queueIndex,
    }: { pos: Position; returnToPos?: boolean; ifFull?: boolean } & QueueParams) => {
      const action = async () => {
        const data = await refetch()

        if (ifFull && data.data?.inventory) {
          const { usedSlots, usedInventory } = data.data.inventory.reduce(
            (curr, slot) => {
              return {
                usedSlots: curr.usedSlots + (slot.code ? 1 : 0),
                usedInventory: curr.usedInventory + slot.quantity,
              }
            },
            { usedSlots: 0, usedInventory: 0 }
          )
          if (usedSlots < 20 && usedInventory < data.data.inventory_max_items) {
            if (requeue) depositAll({ pos, returnToPos, ifFull, requeue, queueIndex })
            setStatus(Status.Cooldown)
            return null
          }
        }

        if (returnToPos) move({ pos: { x: data.data?.x || 0, y: data.data?.y || 0 }, queueIndex: 0 })
        const toDeposit =
          data.data?.inventory
            ?.filter((slot) => slot.code && slot.quantity > 0)
            .map(({ code, quantity }) => ({ code, quantity })) || []

        if (toDeposit.length) deposit({ items: toDeposit, queueIndex: 0 })
        move({ pos, queueIndex: 0 })
        if (requeue) depositAll({ pos, returnToPos, ifFull, requeue, queueIndex })
        setStatus(Status.Cooldown)
        return null
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat d' : 'D'}eposit all${ifFull ? ' if full' : ''} to ${pos.x},${pos.y}${returnToPos ? ' and return' : ''}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [refetch, deposit, move, queueAction]
  )

  if (!character) return undefined

  return {
    character,
    actions: {
      move,
      rest,
      fight,
      gathering,
      deposit,
      depositAll,
      withdraw,
      craft,
      smartCraft,
      unEquip,
      equip,
      withdrawGold,
      depositGold,
      buyExpansion,
      taskAccept,
      taskTrade,
      taskComplete,
      taskExchange,
      taskAbandon,
      buyItem,
      sellItem,
      consumeItem,
      recycleItem,
      deleteItem,
    },
    lastAction,
    error,
    status,
    timeUntilReady: cooldownExpiration,
    actionQueue,
    togglePause,
    forceUpdate,
  }
}

interface CharacterActionsContextType {
  character: components['schemas']['CharacterSchema'] | null
  actions: {
    move(args: { pos: Position } & QueueParams): void
    rest(args?: QueueParams): void
    fight(args?: QueueParams): void
    deposit(args: { items: { code: string; quantity: number }[] } & QueueParams): void
    withdraw(args: { items: { code: string; quantity: number }[] } & QueueParams): void
    gathering(args?: QueueParams): void
    craft(args: { code: string; quantity: number } & QueueParams): void
    unEquip(args: { slot: components['schemas']['ItemSlot']; quantity: number } & QueueParams): void
    equip(
      args: {
        code: string
        slot: components['schemas']['ItemSlot']
        quantity: number
      } & QueueParams
    ): void
    buyExpansion(args?: QueueParams): void
    withdrawGold(args: { quantity: number } & QueueParams): void
    depositGold(args: { quantity: number } & QueueParams): void
    taskAccept(args?: QueueParams): void
    taskTrade(args: { code: string; quantity: number } & QueueParams): void
    taskComplete(args?: QueueParams): void
    taskExchange(args?: QueueParams): void
    taskAbandon(args?: QueueParams): void
    buyItem(args: { code: string; quantity: number } & QueueParams): void
    sellItem(args: { code: string; quantity: number } & QueueParams): void
    recycleItem(args: { code: string; quantity: number } & QueueParams): void
    deleteItem(args: { code: string; quantity: number } & QueueParams): void
    consumeItem(
      args: {
        item: components['schemas']['ItemSchema']
        quantity: number
      } & QueueParams
    ): void
    smartCraft(
      args: { item: components['schemas']['ItemSchema']; workshop: Position; quantity?: number } & QueueParams
    ): void
    depositAll(args: { pos: Position; returnToPos?: boolean; ifFull?: boolean } & QueueParams): void
  }
  lastAction: ActionData | null
  error: string | null
  status: Status
  timeUntilReady: Temporal.Duration | null
  actionQueue: Stack<Queue<ActionData>>

  togglePause(): void

  forceUpdate(): void
}

const CharacterActionsContext = React.createContext<CharacterActionsContextType | undefined>(undefined)
const CharacterActionsProvider = CharacterActionsContext.Provider

const useCharacterActions = () => {
  const context = React.useContext(CharacterActionsContext)
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider')
  }
  return context
}

export { CharacterActionsProvider, useCharacterActionsContext, Status, useCharacterActions }
