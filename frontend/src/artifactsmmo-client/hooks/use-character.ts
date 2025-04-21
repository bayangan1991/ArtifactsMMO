import { Temporal } from '@js-temporal/polyfill'
import { Guid } from 'guid-typescript'
import { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useInterval } from '../../hooks/use-interval.ts'
import type { ActionData, Position, Queue, QueueParams } from '../../types.ts'
import { Stack } from '../../utils/stack.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'
import { useActions } from './use-actions.ts'
import { useQueueableAction } from './use-queuable-action.ts'
import { useSimpleAction } from './use-simple-action.ts'
import { useStatus } from './use-status.ts'

enum Status {
  Ready = 'ready', // Ready to do the next action
  Paused = 'paused', // Allow use to queue up actions and resume
  Waiting = 'waiting', // Waiting for API response
  Cooldown = 'cooldown', // Currently in cooldown
}

const useCharacter = (name: string | null) => {
  const { client } = useContext(ApiClientContext)
  const timeDiff = useStatus()
  const [character, setCharacter] = useState<components['schemas']['CharacterSchema'] | null>(null)
  const [actionQueue] = useState<Stack<Queue<ActionData>>>(new Stack())
  const [doNextAction, setDoNextAction] = useState<boolean>(false)
  const [lastAction, setLastAction] = useState<ActionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const [cooldownExpiration, setCooldownExpiration] = useState<Temporal.Duration | null>(null)
  const [status, setStatus] = useState<Status>(Status.Ready)
  const [_, forceUpdate] = useReducer((x) => x + 1, 0)

  // Character Data

  const refetch = useCallback(() => {
    if (name)
      return client.GET('/characters/{name}', { params: { path: { name } } }).then(({ data: result }) => {
        if (result) {
          setCharacter(result.data)
          if (result.data?.cooldown_expiration) {
            const newCooldown = Temporal.Instant.from(result.data.cooldown_expiration).add(timeDiff)
            setCooldown(newCooldown)
            const ready = Temporal.Instant.compare(Temporal.Now.instant(), newCooldown) > -1
            setStatus((currentStatus) => {
              if (ready) {
                if (currentStatus === Status.Paused) return Status.Paused
                return Status.Ready
              }
              return Status.Cooldown
            })
          }
        }
        return result
      })
  }, [client, name, timeDiff])

  useEffect(() => {
    if (name) refetch()
  }, [name, refetch])

  // State management

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
  const pollCooldown = useCallback(() => {
    if (cooldownExpiration === null && status === Status.Cooldown) {
      refetch()
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
      actionQueue.pop()?.action()
      setDoNextAction(false)
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
    setCharacter(data.character)
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
    action: doMove,
    onSuccess,
    onError,
    queueAction,
  })

  const deposit = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x ${code}`,
    action: doDeposit,
    onSuccess,
    onError,
    queueAction,
  })

  const withdraw = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x ${code}`,
    action: doWithdraw,
    onSuccess,
    onError,
    queueAction,
  })

  const craft = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat c' : 'C'}raft ${quantity} x ${code}`,
    action: doCraft,
    onSuccess,
    onError,
    queueAction,
  })

  const unEquip = useQueueableAction({
    label: ({ slot, quantity, requeue }) => `${requeue ? 'Repeat u' : 'U'}nequip ${quantity} x ${slot}`,
    action: doUnEquip,
    onSuccess,
    onError,
    queueAction,
  })

  const equip = useQueueableAction({
    label: ({ code, slot, quantity, requeue }) =>
      `${requeue ? 'Repeat e' : 'E'}quip ${quantity} x ${code} into ${slot}`,
    action: doEquip,
    onSuccess,
    onError,
    queueAction,
  })

  const depositGold = useQueueableAction({
    label: ({ quantity, requeue }) => `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x gold`,
    action: doDepositGold,
    onSuccess,
    onError,
    queueAction,
  })

  const withdrawGold = useQueueableAction({
    label: ({ quantity, requeue }) => `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x gold`,
    action: doWithdrawGold,
    onSuccess,
    onError,
    queueAction,
  })

  const taskTrade = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat t' : 'T'}rade ${quantity} x ${code} to task master`,
    action: doTaskTrade,
    onSuccess,
    onError,
    queueAction,
  })

  const buyItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat b' : 'B'}uy ${quantity} x ${code}`,
    action: doBuyItem,
    onSuccess,
    onError,
    queueAction,
  })

  const sellItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat s' : 'S'}ell ${quantity} x ${code}`,
    action: doSellItem,
    onSuccess,
    onError,
    queueAction,
  })

  const recycleItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat r' : 'R'}ecycle ${quantity} x ${code}`,
    action: doRecycleItem,
    onSuccess,
    onError,
    queueAction,
  })

  const deleteItem = useQueueableAction({
    label: ({ code, quantity, requeue }) => `${requeue ? 'Repeat d' : 'D'}elete ${quantity} x ${code}`,
    action: doDeleteItem,
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
    ({ queueIndex, requeue }: QueueParams) => {
      const action = async () => {
        const before = await refetch()
        try {
          const result = await doFight()
          const hpLost = (before?.data.hp || 0) - result.character.hp
          if (requeue) {
            if (result.character.hp - hpLost * 1.5 > 0) {
              fight({ queueIndex: 0, requeue })
            } else {
              fight({ requeue })
            }
          }
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction({ label: `${requeue ? 'Repeat f' : 'F'}ight`, guid: Guid.create(), action }, queueIndex)
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
        let result: Awaited<ReturnType<typeof doConsumeItem>> | null
        let toConsume = quantity
        if (item.effects?.some((effect) => effect.code === 'heal')) {
          const current = await refetch()
          if (current) {
            const missingHp = current.data.max_hp - current.data.hp
            const fullHealQuantity = Math.ceil(missingHp / item.effects[0].value)
            toConsume = Math.min(quantity, fullHealQuantity)
            try {
              result = await doConsumeItem({ code: item.code, quantity: toConsume })
            } catch (err) {
              if (err instanceof Error && err.message) onError(err.message)
              return null
            }
          } else {
            return null
          }
        } else {
          try {
            result = await doConsumeItem({ code: item.code, quantity: quantity })
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
        setStatus(Status.Paused)
        const data = await refetch()
        if (!itemCount || !data) return null
        const craftAmount = quantity || Math.floor(data.data.inventory_max_items / itemCount)
        item.craft.items.map((component) => {
          withdraw({ code: component.code, quantity: component.quantity * craftAmount, queueIndex: 0 })
        })
        craft({ code: item.code, quantity: craftAmount, queueIndex: item.craft.items.length })
        move({ pos: workshop, queueIndex: item.craft.items.length })
        if (requeue) smartCraft({ item, workshop, quantity, requeue })
        setStatus(Status.Ready)
        return null
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat s' : 'S'}mart craft of ${item.name} @ ${workshop.x},${workshop.y}`,
          guid: Guid.create(),
          action: handleSmartCraft,
        },
        queueIndex
      )
    },
    [craft, move, withdraw, refetch, queueAction]
  )

  const depositAll = useCallback(
    ({ pos, requeue, returnToPos, queueIndex }: { pos: Position; returnToPos?: boolean } & QueueParams) => {
      const action = async () => {
        const data = await refetch()
        move({ pos, queueIndex: 0 })
        if (returnToPos) move({ pos: { x: data?.data.x || 0, y: data?.data.y || 0 }, queueIndex: 1 })
        for (const slot of data?.data.inventory || []) {
          if (slot.code) deposit({ code: slot.code, quantity: slot.quantity, queueIndex: 1 })
        }
        if (requeue) depositAll({ pos, requeue, returnToPos })
        return null
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat d' : 'D'}eposit all to ${pos.x},${pos.y}${returnToPos ? ' and return' : ''}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [refetch, deposit, move, queueAction]
  )

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
export { useCharacter, Status }
