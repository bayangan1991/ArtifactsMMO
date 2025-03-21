import { Temporal } from '@js-temporal/polyfill'
import { Guid } from 'guid-typescript'
import { useCallback, useEffect, useState } from 'react'
import { useInterval } from '../../hooks/use-interval.ts'
import type { ActionData, Position, Queue } from '../../types.ts'
import { Stack } from '../../utils/stack.ts'
import { client } from '../client.ts'
import type { components } from '../spec'
import { useActions } from './use-actions.ts'
import { useSimpleAction } from './use-simple-action.ts'

enum Status {
  Ready = 'ready', // Ready to do the next action
  Waiting = 'waiting', // Waiting for API response
  Cooldown = 'cooldown', // Currently in cooldown
}

const useCharacter = (name: string | null) => {
  const [character, setCharacter] = useState<components['schemas']['CharacterSchema'] | null>(null)
  const [actionQueue] = useState<Stack<Queue<ActionData>>>(new Stack())
  const [doNextAction, setDoNextAction] = useState<boolean>(false)
  const [lastAction, setLastAction] = useState<ActionData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const [timeUntilReady, setTimeUntilReady] = useState<Temporal.Duration | null>(null)
  const [status, setStatus] = useState<Status>(Status.Ready)

  // Character Data

  const refetch = useCallback(() => {
    if (name)
      client.GET('/characters/{name}', { params: { path: { name } } }).then(({ data: result }) => {
        if (result) {
          setCharacter(result.data)
          if (result.data?.cooldown_expiration) {
            setCooldown(Temporal.Instant.from(result.data.cooldown_expiration))
          }
        }
      })
  }, [name])

  useEffect(() => {
    if (name) refetch()
  }, [name, refetch])

  // Clock

  // Update timeUntilReady
  const onTick = useCallback(() => {
    const ready = Temporal.Instant.compare(Temporal.Now.instant(), cooldown) > -1
    if (ready) {
      setTimeUntilReady(null)
      setStatus(Status.Ready)
    } else {
      setTimeUntilReady(Temporal.Now.instant().until(cooldown))
      setStatus(Status.Cooldown)
    }
  }, [cooldown])
  useInterval(onTick, 100 as const)

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
    (queue: Queue<ActionData>, force = false) => {
      if (!force && actionQueue.size() === 0 && status === Status.Ready) {
        queue.action()
        setStatus(Status.Waiting)
      } else {
        actionQueue.push(queue)
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

  const { doMove, doDeposit, doWithdraw } = useActions({ onSuccess, onError })

  const move = useCallback(
    (pos: Position) => {
      if (name)
        queueAction({ label: `Move to ${pos.x},${pos.y}`, guid: Guid.create(), action: () => doMove(name, pos) })
    },
    [name, doMove, queueAction]
  )

  const deposit = useCallback(
    (code: string, quantity: number) => {
      if (name)
        queueAction({
          label: `Deposit ${quantity} x ${code}`,
          guid: Guid.create(),
          action: () => doDeposit(name, code, quantity),
        })
    },
    [name, doDeposit, queueAction]
  )

  const withdraw = useCallback(
    (code: string, quantity: number) => {
      if (name)
        queueAction({
          label: `Withdraw ${quantity} x ${code}`,
          guid: Guid.create(),
          action: () => doWithdraw(name, code, quantity),
        })
    },
    [name, doWithdraw, queueAction]
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
    actions: { move, rest, repeatRest, fight, repeatFight, gathering, repeatGathering, deposit, withdraw },
    lastAction,
    error,
    status,
    timeUntilReady,
    actionQueue,
  }
}
export { useCharacter, Status }
