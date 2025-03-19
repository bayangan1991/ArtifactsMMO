import { Card } from 'react-bootstrap'
import type { Queue } from '../../types.ts'

interface Props {
  queue: Queue[]
}

const ActionQueueCard = ({ queue }: Props) => (
  <Card>
    <Card.Body>
      <Card.Title>Action Queue</Card.Title>
      <ol>
        {queue.map((item) => {
          return <li key={item.guid.toString()}>{item.label}</li>
        })}
      </ol>
    </Card.Body>
  </Card>
)

export { ActionQueueCard }
