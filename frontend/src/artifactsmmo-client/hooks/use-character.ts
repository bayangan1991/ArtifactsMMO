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
  } = useActions(name)

  const move = useCallback(
    (pos: Position, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doMove(pos)
          if (requeue) move(pos, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        { label: `${requeue ? 'Repeat m' : 'M'}ove to ${pos.x},${pos.y}`, guid: Guid.create(), action },
        queueIndex
      )
    },
    [doMove, queueAction, onError, onSuccess]
  )

  const fight = useCallback(
    (queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        const before = await refetch()
        try {
          const result = await doFight()
          const hpLost = (before?.data.hp || 0) - result.character.hp
          if (result.character.hp - hpLost * 1.5 > 0) {
            fight(0, requeue)
          } else {
            fight(undefined, requeue)
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

  const deposit = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doDeposit(code, quantity)
          if (requeue) deposit(code, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x ${code}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doDeposit, queueAction, onError, onSuccess]
  )

  const withdraw = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doWithdraw(code, quantity)
          if (requeue) withdraw(code, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x ${code}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doWithdraw, queueAction, onError, onSuccess]
  )

  const craft = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doCraft(code, quantity)
          if (requeue) craft(code, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat c' : 'C'}raft ${quantity} x ${code}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doCraft, queueAction, onError, onSuccess]
  )

  const unEquip = useCallback(
    (slot: components['schemas']['ItemSlot'], quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doUnEquip(slot, quantity)
          if (requeue) unEquip(slot, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat u' : 'U'}nequip ${quantity} x ${slot}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doUnEquip, queueAction, onError, onSuccess]
  )

  const equip = useCallback(
    (
      code: string,
      slot: components['schemas']['ItemSlot'],
      quantity: number,
      queueIndex?: number,
      requeue?: boolean
    ) => {
      const action = async () => {
        try {
          const result = await doEquip(code, slot, quantity)
          if (requeue) equip(code, slot, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat e' : 'E'}quip ${quantity} x ${code} into ${slot}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doEquip, queueAction, onError, onSuccess]
  )

  const depositGold = useCallback(
    (quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doDepositGold(quantity)
          if (requeue) depositGold(quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat d' : 'D'}eposit ${quantity} x gold`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doDepositGold, queueAction, onError, onSuccess]
  )

  const withdrawGold = useCallback(
    (quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doWithdrawGold(quantity)
          if (requeue) withdrawGold(quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x gold`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doWithdrawGold, queueAction, onError, onSuccess]
  )

  const taskTrade = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doTaskTrade(code, quantity)
          if (requeue) taskTrade(code, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat t' : 'T'}rade ${quantity} x ${code} to task master`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doTaskTrade, queueAction, onError, onSuccess]
  )

  const buyItem = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doBuyItem(code, quantity)
          if (requeue) buyItem(code, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat b' : 'B'}uy ${quantity} x ${code}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doBuyItem, queueAction, onError, onSuccess]
  )

  const sellItem = useCallback(
    (code: string, quantity: number, queueIndex?: number, requeue?: boolean) => {
      const action = async () => {
        try {
          const result = await doSellItem(code, quantity)
          if (requeue) sellItem(code, quantity, queueIndex, requeue)
          onSuccess(result)
          return result
        } catch (err) {
          if (err instanceof Error && err.message) onError(err.message)
          return null
        }
      }

      queueAction(
        {
          label: `${requeue ? 'Repeat s' : 'S'}ell ${quantity} x ${code}`,
          guid: Guid.create(),
          action,
        },
        queueIndex
      )
    },
    [doSellItem, queueAction, onError, onSuccess]
  )

  const consumeItem = useCallback(
    (item: components['schemas']['ItemSchema'], quantity: number, queueIndex?: number, requeue?: boolean) => {
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
              result = await doConsumeItem(item.code, toConsume)
            } catch (err) {
              if (err instanceof Error && err.message) onError(err.message)
              return null
            }
          } else {
            return null
          }
        } else {
          try {
            result = await doConsumeItem(item.code, quantity)
          } catch (err) {
            if (err instanceof Error && err.message) onError(err.message)
            return null
          }
        }
        if (requeue && quantity - toConsume > 0) consumeItem(item, quantity - toConsume, queueIndex, requeue)
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

  // Composite Actions

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
      const action = async () => {
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
        action,
      })
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
