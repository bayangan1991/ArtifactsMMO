import { Card } from 'react-bootstrap'
import type { Queue } from '../../types.ts'

interface Props {
  queue: Queue[]
}

const ActionStackCard = ({ queue }: Props) => (
  <Card>
    <Card.Body>
      <Card.Title>Action Stack</Card.Title>
      <ol>
        {queue.map((item) => {
          return <li key={item.guid.toString()}>{item.label}</li>
        })}
      </ol>
    </Card.Body>
  </Card>
)

export { ActionStackCard }
