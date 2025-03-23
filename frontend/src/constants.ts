import { Status } from './artifactsmmo-client/hooks/use-character.ts'

export const RESOURCE_TYPES = ['monster', 'resource', 'workshop', 'bank', 'grand_exchange', 'tasks_master', 'npc']

export const StatusColour: { [key in Status]: string } = {
  [Status.Cooldown]: 'warning',
  [Status.Waiting]: 'danger',
  [Status.Ready]: 'success',
}
