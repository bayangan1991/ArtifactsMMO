import type { Temporal } from '@js-temporal/polyfill'
import React from 'react'
import { Status } from '../../../artifactsmmo-client/hooks/use-character.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import type { ActionData, Position, Queue } from '../../../types.ts'
import { Stack } from '../../stack.ts'

interface CharacterContextType {
  character: components['schemas']['CharacterSchema'] | null
  actions: {
    move(pos: Position, queueIndex?: number, requeue?: boolean): void
    rest(): void
    repeatRest(): void
    fight(): void
    repeatFight(): void
    deposit(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    depositAll(pos: Position, requeue?: boolean, returnToPos?: boolean): void
    withdraw(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    gathering(): void
    repeatGathering(): void
    craft(code: string, quantity: number, requeue?: boolean): void
    unEquip(slot: components['schemas']['ItemSlot'], quantity: number, queueIndex?: number, requeue?: boolean): void
    equip(
      code: string,
      slot: components['schemas']['ItemSlot'],
      quantity: number,
      queueIndex?: number,
      requeue?: boolean
    ): void
  }
  lastAction: ActionData | null
  error: string | null
  status: Status
  timeUntilReady: Temporal.Duration | null
  actionQueue: Stack<Queue<ActionData>>
  togglePause(): void
}

const notImplemented = () => {
  throw new Error('Function not implemented.')
}

const CharacterContext = React.createContext<CharacterContextType>({
  character: null,
  actions: {
    move: notImplemented,
    rest: notImplemented,
    repeatRest: notImplemented,
    fight: notImplemented,
    repeatFight: notImplemented,
    deposit: notImplemented,
    depositAll: notImplemented,
    withdraw: notImplemented,
    gathering: notImplemented,
    repeatGathering: notImplemented,
    craft: notImplemented,
    unEquip: notImplemented,
    equip: notImplemented,
  },
  lastAction: null,
  error: null,
  status: Status.Waiting,
  timeUntilReady: null,
  actionQueue: new Stack(),
  togglePause: notImplemented,
})

export { CharacterContext }
