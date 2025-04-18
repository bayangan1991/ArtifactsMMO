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
    rest(queueIndex?: number, requeue?: boolean): void
    fight(queueIndex?: number, requeue?: boolean): void
    deposit(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    depositAll(pos: Position, requeue?: boolean, returnToPos?: boolean): void
    withdraw(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    gathering(queueIndex?: number, requeue?: boolean): void
    craft(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    smartCraft(item: components['schemas']['ItemSchema'], workshop: Position, requeue?: boolean): void
    unEquip(slot: components['schemas']['ItemSlot'], quantity: number, queueIndex?: number, requeue?: boolean): void
    equip(
      code: string,
      slot: components['schemas']['ItemSlot'],
      quantity: number,
      queueIndex?: number,
      requeue?: boolean
    ): void
    buyExpansion(queueIndex?: number, requeue?: boolean): void
    withdrawGold(quantity: number, queueIndex?: number, requeue?: boolean): void
    depositGold(quantity: number, queueIndex?: number, requeue?: boolean): void
    taskAccept(queueIndex?: number, requeue?: boolean): void
    taskTrade(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    taskComplete(queueIndex?: number, requeue?: boolean): void
    taskExchange(queueIndex?: number, requeue?: boolean): void
    taskAbandon(queueIndex?: number, requeue?: boolean): void
    buyItem(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
    sellItem(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
  }
  lastAction: ActionData | null
  error: string | null
  status: Status
  timeUntilReady: Temporal.Duration | null
  actionQueue: Stack<Queue<ActionData>>
  togglePause(): void
  forceUpdate(): void
}

const notImplemented = () => {
  throw new Error('Function not implemented.')
}

const CharacterContext = React.createContext<CharacterContextType>({
  character: null,
  actions: {
    move: notImplemented,
    rest: notImplemented,
    fight: notImplemented,
    deposit: notImplemented,
    depositAll: notImplemented,
    withdraw: notImplemented,
    gathering: notImplemented,
    craft: notImplemented,
    smartCraft: notImplemented,
    unEquip: notImplemented,
    equip: notImplemented,
    buyExpansion: notImplemented,
    withdrawGold: notImplemented,
    depositGold: notImplemented,
    taskAccept: notImplemented,
    taskTrade: notImplemented,
    taskComplete: notImplemented,
    taskExchange: notImplemented,
    taskAbandon: notImplemented,
    buyItem: notImplemented,
    sellItem: notImplemented,
  },
  lastAction: null,
  error: null,
  status: Status.Waiting,
  timeUntilReady: null,
  actionQueue: new Stack(),
  togglePause: notImplemented,
  forceUpdate: notImplemented,
})

export { CharacterContext }
