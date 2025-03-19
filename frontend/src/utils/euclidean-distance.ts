import type { Position } from '../types.ts'

export const euclideanDistance = (a: Position, b: Position) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}
