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
type RestData = components['schemas']['CharacterRestDataSchema']
type BankGoldTransaction = components['schemas']['BankGoldTransactionSchema']
type BankTransactionData = components['schemas']['BankItemTransactionSchema']
type EquipmentData = components['schemas']['EquipRequestSchema']
type TaskTradeData = components['schemas']['TaskTradeDataSchema']
type NpcTransactionData = components['schemas']['NpcMerchantTransactionSchema']

type ActionData =
  | MovementData
  | FightData
  | SkillData
  | BankTransactionData
  | RestData
  | EquipmentData
  | BankGoldTransaction
  | TaskTradeData
  | NpcTransactionData

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
  BankGoldTransaction,
  EquipmentData,
  RestData,
  TaskTradeData,
  NpcTransactionData,
  ActionData,
  Queue,
  Position,
}
