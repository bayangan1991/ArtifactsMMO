import type { Guid } from 'guid-typescript'

export type Position = { x: number; y: number }
export type VoidFunction = () => void

export interface Queue {
  guid: Guid
  label: string
  action: VoidFunction
}
