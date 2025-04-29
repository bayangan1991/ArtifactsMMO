import { Card, ListGroup } from 'react-bootstrap'
import { useCharacterContext } from '../../utils/contexts/character/context.ts'

const ActionQueueCard = () => {
  const { actionQueue, forceUpdate } = useCharacterContext()
  const queueSize = actionQueue.size()

  if (queueSize === 0) return

  return (
    <Card>
      <Card.Body>
        <Card.Title>Action Queue</Card.Title>
        <ListGroup variant="flush" numbered style={{ maxHeight: 300, overflowY: 'auto' }}>
          {actionQueue.data().map((item, i) => {
            return (
              <ListGroup.Item
                action
                onClick={() => {
                  actionQueue.remove(i)
                  forceUpdate()
                }}
                key={item.guid.toString()}
              >
                {item.label}
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export { ActionQueueCard }
