import { Temporal } from '@js-temporal/polyfill'
import { Guid } from 'guid-typescript'
import { useCallback, useContext, useEffect, useState } from 'react'
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
            setStatus(ready ? Status.Ready : Status.Cooldown)
          }
        }
        return result
      })
  }, [client, name, timeDiff])

  useEffect(() => {
    if (name) refetch()
  }, [name, refetch])

  // Clock

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
    (queue: Queue<ActionData>, force = false, index?: number) => {
      if (!force && actionQueue.size() === 0 && status === Status.Ready) {
        queue.action()
        setStatus(Status.Waiting)
      } else {
        if (index !== undefined) {
          actionQueue.insert(queue, index)
        } else {
          actionQueue.push(queue)
        }
      }
    },
    [actionQueue, status]
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

  const { doMove, doDeposit, doWithdraw, doCraft } = useActions({ onSuccess, onError })

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
          false,
          queueIndex
        )
      }
    },
    [name, doMove, queueAction]
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
          false,
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

        queueAction({
          label: `${requeue ? 'Repeat w' : 'W'}ithdraw ${quantity} x ${code}`,
          guid: Guid.create(),
          action: handleWithdraw,
        })
      }
    },
    [name, doWithdraw, queueAction]
  )

  const craft = useCallback(
    (code: string, quantity: number, requeue?: boolean) => {
      if (name) {
        const handleCraft = async () => {
          const result = await doCraft(name, code, quantity)
          if (result && requeue) craft(code, quantity, requeue)
          return result
        }

        queueAction({
          label: `${requeue ? 'Repeat c' : 'C'}raft ${quantity} x ${code}`,
          guid: Guid.create(),
          action: handleCraft,
        })
      }
    },
    [name, doCraft, queueAction]
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
        if (requeue) {
          depositAll(pos, requeue, returnToPos)
        }
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

  const [rest, repeatRest] = useSimpleAction({
    name,
    label: 'Rest',
    action: '/my/{name}/action/rest',
    onSuccess,
    onError,
    queueAction,
  })
  const [fight, repeatFight] = useSimpleAction({
    name,
    label: 'Fight',
    action: '/my/{name}/action/fight',
    onSuccess,
    onError,
    queueAction,
  })
  const [gathering, repeatGathering] = useSimpleAction({
    name: name,
    label: 'Gathering',
    action: '/my/{name}/action/gathering',
    onSuccess,
    onError,
    queueAction,
  })

  return {
    character,
    refetch,
    actions: {
      move,
      rest,
      repeatRest,
      fight,
      repeatFight,
      gathering,
      repeatGathering,
      deposit,
      depositAll,
      withdraw,
      craft,
    },
    lastAction,
    error,
    status,
    timeUntilReady: cooldownExpiration,
    actionQueue,
  }
}
export { useCharacter, Status }
