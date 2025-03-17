import { Temporal } from '@js-temporal/polyfill'
import { Guid } from 'guid-typescript'
import type { PathsWithMethod } from 'openapi-typescript-helpers'
import { useCallback, useEffect, useState } from 'react'
import { useInterval } from '../../hooks/use-interval.ts'
import { useStack } from '../../hooks/use-stack.ts'
import type { Position, Queue } from '../../types.ts'
import { client } from '../client.ts'
import type { components, paths } from '../spec'

interface HasCooldown {
  data: { cooldown: { expiration: string } }
}

interface UseSimpleActionParams<T extends HasCooldown> {
  name: string | null
  label: string
  action: PathsWithMethod<paths, 'post'>
  callback: (data: T) => void
  queueAction: (action: Queue) => void
}

enum Status {
  Ready = 'ready', // Ready to do the next action
  Waiting = 'waiting', // Waiting for API response
  Cooldown = 'cooldown', // Currently in cooldown
}

const UPDATE_DELAY = 100 as const

const useSimpleAction = ({ name, label, action, callback, queueAction }: UseSimpleActionParams<HasCooldown>) => {
  const doAction = useCallback(async (): Promise<null> => {
    if (name) {
      const result = await client.POST(action, {
        params: { path: { name } },
      })
      if (result?.data) {
        callback(result.data as unknown as HasCooldown)
      }
    }
    return null
  }, [name, action, callback])

  return useCallback(() => {
    queueAction({ label, guid: Guid.create(), action: doAction })
  }, [doAction, label, queueAction])
}

const useCharacter = (name: string | null) => {
  const [character, setCharacter] = useState<components['schemas']['CharacterSchema'] | null>(null)
  const { stack: actionQueue, pushRight, popLeft } = useStack<Queue>()
  const [lastAction, setLastAction] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const [timeUntilReady, setTimeUntilReady] = useState<Temporal.Duration | null>(null)
  const [status, setStatus] = useState<Status>(Status.Waiting)

  useEffect(() => {
    if (character) {
      if (character.cooldown_expiration) {
        setStatus(Status.Cooldown)
        setCooldown(Temporal.Instant.from(character.cooldown_expiration))
      }
    }
  }, [character])

  const onTick = useCallback(() => {
    setStatus((currentStatus) => {
      if (currentStatus !== Status.Waiting) {
        const ready = Temporal.Instant.compare(Temporal.Now.instant(), cooldown) > -1

        if (ready) {
          setTimeUntilReady(null)
          const nextAction = popLeft()
          if (nextAction) {
            nextAction.action()
            return Status.Waiting
          }
          return Status.Ready
        }
        setTimeUntilReady(Temporal.Now.instant().until(cooldown))
      }
      return currentStatus
    })
  }, [cooldown, popLeft])

  useInterval(onTick, UPDATE_DELAY)

  const refetch = useCallback(() => {
    if (name)
      client.GET('/characters/{name}', { params: { path: { name } } }).then(({ data: result }) => {
        if (result) {
          setCharacter(result.data)
        }
      })
  }, [name])

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only want the update to happen when name changes
  useEffect(() => {
    if (name) refetch()
  }, [name])

  // Defined Actions

  const queueAction = useCallback(
    (queue: Queue) => {
      if (actionQueue.size() === 0 && status === Status.Ready) {
        queue.action()
        setStatus(Status.Waiting)
        setLastAction(queue.label)
      } else {
        pushRight(queue)
      }
    },
    [actionQueue.size, status, pushRight]
  )

  const doMove = useCallback(
    async ({ x, y }: Position): Promise<null | components['schemas']['CharacterMovementDataSchema']> => {
      if (name)
        try {
          const { data: moveResult } = await client.POST('/my/{name}/action/move', {
            body: { x, y },
            params: {
              path: { name },
            },
          })
          if (moveResult) {
            setStatus(Status.Cooldown)
            setCooldown(Temporal.Instant.from(moveResult.data.cooldown.expiration))
          }
        } catch {
          return null
        }
      return null
    },
    [name]
  )
  const move = useCallback(
    (pos: Position) => {
      queueAction({ label: `Move to ${pos.x},${pos.y}`, guid: Guid.create(), action: () => doMove(pos) })
    },
    [doMove, queueAction]
  )

  const doDeposit = useCallback(
    async (code: string, quantity: number) => {
      if (name)
        try {
          const { data: depositResult } = await client.POST('/my/{name}/action/bank/deposit', {
            body: { code, quantity },
            params: {
              path: { name },
            },
          })
          if (depositResult) {
            setStatus(Status.Cooldown)
            setCooldown(Temporal.Instant.from(depositResult.data.cooldown.expiration))
          }
        } catch {
          return null
        }
      return null
    },
    [name]
  )
  const deposit = (code: string, quantity: number) => {
    queueAction({
      label: `Deposit ${quantity} x ${code}`,
      guid: Guid.create(),
      action: () => doDeposit(code, quantity),
    })
  }

  const doWithdraw = useCallback(
    async (code: string, quantity: number) => {
      if (name)
        try {
          const { data: withdrawResult } = await client.POST('/my/{name}/action/bank/withdraw', {
            body: { code, quantity },
            params: {
              path: { name },
            },
          })
          if (withdrawResult) {
            setStatus(Status.Cooldown)
            setCooldown(Temporal.Instant.from(withdrawResult.data.cooldown.expiration))
          }
        } catch {
          return null
        }
      return null
    },
    [name]
  )
  const withdraw = useCallback(
    (code: string, quantity: number) => {
      queueAction({
        label: `Withdraw ${quantity} x ${code}`,
        guid: Guid.create(),
        action: () => doWithdraw(code, quantity),
      })
    },
    [doWithdraw, queueAction]
  )

  const updateCooldown = (data: HasCooldown) => {
    setStatus(Status.Cooldown)
    setCooldown(Temporal.Instant.from(data.data.cooldown.expiration))
  }

  const rest = useSimpleAction({
    name,
    label: 'Rest',
    action: '/my/{name}/action/rest',
    callback: updateCooldown,
    queueAction: queueAction,
  })
  const fight = useSimpleAction({
    name,
    label: 'Fight',
    action: '/my/{name}/action/fight',
    callback: updateCooldown,
    queueAction: queueAction,
  })
  const gathering = useSimpleAction({
    name: name,
    label: 'Gathering',
    action: '/my/{name}/action/gathering',
    callback: updateCooldown,
    queueAction: queueAction,
  })

  return {
    character,
    refetch,
    actions: { move, rest, fight, gathering, deposit, withdraw },
    lastAction,
    status,
    timeUntilReady,
    actionQueue,
  }
}
export { useCharacter, Status }
