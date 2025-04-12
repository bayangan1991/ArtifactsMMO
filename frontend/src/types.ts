import type { Guid } from 'guid-typescript'
import type { components } from './artifactsmmo-client/spec'

type Position = { x: number; y: number }

interface Queue<T> {
  guid: Guid
  label: string
  action: () => Promise<T | null>
}

type MovementData = components['schemas']['CharacterMovementDataSchema']
type FightData = components['schemas']['CharacterFightDataSchema']
type SkillData = components['schemas']['SkillDataSchema']
type BankTransactionData = components['schemas']['BankItemTransactionSchema']
type RestData = components['schemas']['CharacterRestDataSchema']
type EquipmentData = components['schemas']['EquipmentResponseSchema']['data']

type ActionData = MovementData | FightData | SkillData | BankTransactionData | RestData | EquipmentData

interface PaginationType {
  page: number
  pages?: number | null
  setPage(page: number): void
}

export type {
  PaginationType,
  MovementData,
  FightData,
  SkillData,
  BankTransactionData,
  RestData,
  ActionData,
  Queue,
  Position,
}
