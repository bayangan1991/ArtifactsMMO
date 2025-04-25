import { Status } from './artifactsmmo-client/hooks/use-character.ts'
import type { components } from './artifactsmmo-client/spec'

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
