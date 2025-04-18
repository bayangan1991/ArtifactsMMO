import { Temporal } from '@js-temporal/polyfill'
import { Guid } from 'guid-typescript'
import { useCallback, useContext, useEffect, useReducer, useState } from 'react'
import { useInterval } from '../../hooks/use-interval.ts'
import type { ActionData, Position, Queue } from '../../types.ts'
import { Stack } from '../../utils/stack.ts'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'
import { useActions } from './use-actions.ts'
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
  useInterval(pollQueue, 1000 as const)

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
  } = useActions({
    onSuccess,
    onError,
  })

  const move = useCallback(
    (pos: Position, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleMove = async () => {
          const result = await doMove(name, pos)
          if (result && requeue) move(pos, queueIndex, requeue)
          return result
        }

        queueAction(
          { label: `${requeue ? 'Repeat m' : 'M'}ove to ${pos.x},${pos.y}`, guid: Guid.create(), action: handleMove },
          queueIndex
        )
      }
    },
    [name, doMove, queueAction]
  )

  const fight = useCallback(
    (queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleFight = async () => {
          const before = await refetch()
          const result = await doFight(name)
          if (result && requeue) {
            const hpLost = (before?.data.hp || 0) - result.character.hp
            if (result.character.hp - hpLost * 1.5 > 0) {
              fight(0, requeue)
            } else {
              fight(undefined, requeue)
            }
          }
          return result
        }

        queueAction(
          { label: `${requeue ? 'Repeat f' : 'F'}ight`, guid: Guid.create(), action: handleFight },
          queueIndex
        )
      }
    },
    [name, doFight, queueAction, refetch]
  )

  const deposit = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleDeposit = async () => {
          const result = await doDeposit(name, code, quantity)
          if (result && requeue) deposit(code, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x ${code}`,
            guid: Guid.create(),
            action: handleDeposit,
          },
          queueIndex
        )
      }
    },
    [name, doDeposit, queueAction]
  )

  const withdraw = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleWithdraw = async () => {
          const result = await doWithdraw(name, code, quantity)
          if (result && requeue) withdraw(code, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x ${code}`,
            guid: Guid.create(),
            action: handleWithdraw,
          },
          queueIndex
        )
      }
    },
    [name, doWithdraw, queueAction]
  )

  const craft = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleCraft = async () => {
          const result = await doCraft(name, code, quantity)
          if (result && requeue) craft(code, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat c' : 'C'}raft ${quantity} x ${code}`,
            guid: Guid.create(),
            action: handleCraft,
          },
          queueIndex
        )
      }
    },
    [name, doCraft, queueAction]
  )

  const smartCraft = useCallback(
    (item: components['schemas']['ItemSchema'], workshop: Position, requeue?: boolean) => {
      const handleSmartCraft = async () => {
        if (!item.craft || !item?.craft.items) return null
        const itemCount = item.craft.items.reduce((count, component) => count + component.quantity, 0)
        setStatus(Status.Paused)
        const data = await refetch()
        if (!itemCount || !data) return null
        const craftAmount = Math.floor(data.data.inventory_max_items / itemCount)
        item.craft.items.map((component) => {
          withdraw(component.code, component.quantity * craftAmount, 0)
        })
        craft(item.code, craftAmount, item.craft.items.length)
        move(workshop, item.craft.items.length)
        if (requeue) smartCraft(item, workshop, requeue)
        setStatus(Status.Ready)
        return null
      }

      queueAction({
        label: `${requeue ? 'Repeat s' : 'S'}mart craft of ${item.name} @ ${workshop.x},${workshop.y}`,
        guid: Guid.create(),
        action: handleSmartCraft,
      })
    },
    [craft, move, withdraw, refetch, queueAction]
  )

  const depositAll = useCallback(
    (pos: Position, requeue?: boolean, returnToPos?: boolean) => {
      const handleDepositAll = async () => {
        const data = await refetch()
        move(pos, 0)
        if (returnToPos) move({ x: data?.data.x || 0, y: data?.data.y || 0 }, 1)
        for (const slot of data?.data.inventory || []) {
          if (slot.code) deposit(slot.code, slot.quantity, 1)
        }
        if (requeue) depositAll(pos, requeue, returnToPos)
        return null
      }

      queueAction({
        label: `${requeue ? 'Repeat d' : 'D'}eposit all to ${pos.x},${pos.y}${returnToPos ? ' and return' : ''}`,
        guid: Guid.create(),
        action: handleDepositAll,
      })
    },
    [refetch, deposit, move, queueAction]
  )

  const unEquip = useCallback(
    (slot: components['schemas']['ItemSlot'], quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleUnEquip = async () => {
          const result = await doUnEquip(name, slot, quantity)
          if (result && requeue) unEquip(slot, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat u' : 'U'}nequip ${quantity} x ${slot}`,
            guid: Guid.create(),
            action: handleUnEquip,
          },
          queueIndex
        )
      }
    },
    [name, doUnEquip, queueAction]
  )

  const equip = useCallback(
    (
      code: string,
      slot: components['schemas']['ItemSlot'],
      quantity: number,
      queueIndex?: number,
      requeue?: boolean
    ) => {
      if (name) {
        const handleEquip = async () => {
          const result = await doEquip(name, code, slot, quantity)
          if (result && requeue) equip(code, slot, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat e' : 'E'}quip ${quantity} x ${code} into ${slot}`,
            guid: Guid.create(),
            action: handleEquip,
          },
          queueIndex
        )
      }
    },
    [name, doEquip, queueAction]
  )

  const depositGold = useCallback(
    (quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleEquip = async () => {
          const result = await doDepositGold(name, quantity)
          if (result && requeue) depositGold(quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x gold`,
            guid: Guid.create(),
            action: handleEquip,
          },
          queueIndex
        )
      }
    },
    [name, doDepositGold, queueAction]
  )

  const withdrawGold = useCallback(
    (quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleEquip = async () => {
          const result = await doWithdrawGold(name, quantity)
          if (result && requeue) withdrawGold(quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x gold`,
            guid: Guid.create(),
            action: handleEquip,
          },
          queueIndex
        )
      }
    },
    [name, doWithdrawGold, queueAction]
  )

  const taskTrade = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleTaskTrade = async () => {
          const result = await doTaskTrade(name, code, quantity)
          if (result && requeue) taskTrade(code, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat t' : 'T'}rade ${quantity} x ${code} to task master`,
            guid: Guid.create(),
            action: handleTaskTrade,
          },
          queueIndex
        )
      }
    },
    [name, doTaskTrade, queueAction]
  )

  const buyItem = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleBuyItem = async () => {
          const result = await doBuyItem(name, code, quantity)
          if (result && requeue) buyItem(code, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat b' : 'B'}uy ${quantity} x ${code}`,
            guid: Guid.create(),
            action: handleBuyItem,
          },
          queueIndex
        )
      }
    },
    [name, doBuyItem, queueAction]
  )
  const sellItem = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      if (name) {
        const handleSellItem = async () => {
          const result = await doSellItem(name, code, quantity)
          if (result && requeue) sellItem(code, quantity, queueIndex, requeue)
          return result
        }

        queueAction(
          {
            label: `${requeue ? 'Repeat s' : 'S'}ell ${quantity} x ${code}`,
            guid: Guid.create(),
            action: handleSellItem,
          },
          queueIndex
        )
      }
    },
    [name, doSellItem, queueAction]
  )

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
