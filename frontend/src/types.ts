import type { Guid } from 'guid-typescript'
import type { components } from './artifactsmmo-client/spec'

type Position = { x: number; y: number }
type VoidFunction = () => void

interface Queue {
  guid: Guid
  label: string
  action: VoidFunction
}

type MovementData = components['schemas']['CharacterMovementDataSchema']
type FightData = components['schemas']['CharacterFightDataSchema']
type SkillData = components['schemas']['SkillDataSchema']
type BankTransactionData = components['schemas']['BankItemTransactionSchema']
type RestData = components['schemas']['CharacterRestDataSchema']

type Data = MovementData | FightData | SkillData | BankTransactionData | RestData

const isType = <T extends Data>(response: T, reason: components['schemas']['ActionType']): boolean =>
  response.cooldown.reason === reason

export type { MovementData, FightData, SkillData, BankTransactionData, RestData, Data, Queue, Position, VoidFunction }
export { isType }
