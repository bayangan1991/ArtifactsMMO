import { Button, Stack } from 'react-bootstrap'
import { useCharacterContext } from '../../../utils/contexts/character/context.ts'

const TasksMasterDetail = () => {
  const {
    character,
    actions: { taskAccept, taskComplete, taskExchange, taskTrade },
  } = useCharacterContext()

  const taskItemQuantity = Math.min(
    character?.inventory?.reduce((acc, item) => {
      if (item.code === character?.task) {
        return acc + item.quantity
      }
      return acc
    }, 0) || 0,
    (character?.task_total || 0) - (character?.task_progress || 0)
  )

  return (
    <Stack gap={2} direction="horizontal">
      <Button onClick={() => taskAccept()}>Accept Task</Button>
      {character?.task && character?.task_total && (
        <Button onClick={() => taskTrade({ code: character.task, quantity: taskItemQuantity })}>Trade Items</Button>
      )}
      <Button onClick={() => taskComplete()}>Complete Task</Button>
      <Button onClick={() => taskExchange()}>Random Reward</Button>
    </Stack>
  )
}

export { TasksMasterDetail }
