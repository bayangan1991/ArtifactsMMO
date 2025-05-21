import type { components } from './artifactsmmo-client/spec'
import { Status } from './hooks/use-character-actions.ts'

export const MAP_CONTENT_TYPES: Record<components['schemas']['MapContentType'], string> = {
  monster: 'Monster',
  resource: 'Resource',
  workshop: 'Workshop',
  bank: 'Bank',
  grand_exchange: 'Grand Exchange',
  tasks_master: 'Tasks Master',
  npc: 'Vendor',
}

export const StatusColour: { [key in Status]: string } = {
  [Status.Cooldown]: 'warning',
  [Status.Waiting]: 'danger',
  [Status.Ready]: 'success',
  [Status.Paused]: 'secondary',
}
