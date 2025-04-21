import type { Temporal } from '@js-temporal/polyfill'
import React from 'react'
import { Status } from '../../../artifactsmmo-client/hooks/use-character.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import type { ActionData, Position, Queue, QueueParams } from '../../../types.ts'
import { Stack } from '../../stack.ts'

interface CharacterContextType {
  character: components['schemas']['CharacterSchema'] | null
  actions: {
    move(args: { pos: Position } & QueueParams): void
    rest(args?: QueueParams): void
    fight(args?: QueueParams): void
    deposit(args: { code: string; quantity: number } & QueueParams): void
    withdraw(args: { code: string; quantity: number } & QueueParams): void
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
    smartCraft(item: components['schemas']['ItemSchema'], workshop: Position, requeue?: boolean): void
    depositAll(pos: Position, requeue?: boolean, returnToPos?: boolean): void
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
    consumeItem: notImplemented,
    recycleItem: notImplemented,
    deleteItem: notImplemented,
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
