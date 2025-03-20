import { Card, ListGroup } from 'react-bootstrap'
import type { ActionData, Queue } from '../../types.ts'

interface Props {
  queue: Queue<ActionData>[]
  handleRemove: (i: number) => void
}

const ActionQueueCard = ({ queue, handleRemove }: Props) => (
  <Card>
    <Card.Body>
      <Card.Title>Action Queue</Card.Title>
      <ListGroup variant="flush" numbered style={{ maxHeight: 300, overflowY: 'auto' }}>
        {queue.map((item, i) => {
          return (
            <ListGroup.Item action onClick={() => handleRemove(i)} key={item.guid.toString()}>
              {item.label}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    </Card.Body>
  </Card>
)

export { ActionQueueCard }
