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

type ActionData = MovementData | FightData | SkillData | BankTransactionData | RestData

const isActionType = <T extends ActionData>(
  response: ActionData,
  reason: components['schemas']['ActionType']
): response is T => response.cooldown.reason === reason

export type { MovementData, FightData, SkillData, BankTransactionData, RestData, ActionData, Queue, Position }
export { isActionType }
