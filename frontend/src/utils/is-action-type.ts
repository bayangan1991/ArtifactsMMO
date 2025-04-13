import type { components } from '../artifactsmmo-client/spec'
import type { ActionData } from '../types.ts'

const isActionType = <T extends ActionData>(
  response: ActionData,
  reason: components['schemas']['ActionType'] | components['schemas']['ActionType'][]
): response is T => response.cooldown.reason === reason || reason.includes(response.cooldown.reason)
export { isActionType }
