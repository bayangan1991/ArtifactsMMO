import type { Temporal } from '@js-temporal/polyfill'
import React from 'react'
import type { Status } from '../../../artifactsmmo-client/hooks/use-character.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import type { ActionData, Position, Queue, QueueParams } from '../../../types.ts'
import type { Stack } from '../../stack.ts'

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

const CharacterContext = React.createContext<CharacterContextType | undefined>(undefined)

const CharacterContextProvider = CharacterContext.Provider

const useCharacterContext = () => {
  const context = React.useContext(CharacterContext)
  if (!context) {
    throw new Error('useCharacterContext must be used within a CharacterProvider')
  }
  return context
}

export { CharacterContextProvider, useCharacterContext }
