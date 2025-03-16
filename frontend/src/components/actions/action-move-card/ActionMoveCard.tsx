import { Guid } from 'guid-typescript'
import { useState } from 'react'
import { Button, Card, FloatingLabel, Form, InputGroup } from 'react-bootstrap'
import type { Position, Queue } from '../../../types.ts'

interface Props {
  doMove: (pos: Position) => void
  queueAction(f: Queue): void
}

const ActionMoveCard = ({ doMove, queueAction }: Props) => {
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })

  const handleMove = (): void => {
    queueAction({
      guid: Guid.create(),
      label: `Move to ${targetPos.x},${targetPos.y}`,
      action: () => doMove(targetPos),
    })
  }

  return (
    <Card>
      <Form>
        <Card.Body>
          <Card.Title>Move Action</Card.Title>
          <InputGroup>
            <FloatingLabel label="X Position">
              <Form.Control
                type="number"
                placeholder="X"
                value={targetPos.x}
                onChange={(e) => setTargetPos({ x: Number(e.target.value), y: targetPos.y })}
              />
            </FloatingLabel>
            <FloatingLabel label="Y Position">
              <Form.Control
                type="number"
                placeholder="Y"
                value={targetPos.y}
                onChange={(e) => setTargetPos({ y: Number(e.target.value), x: targetPos.x })}
              />
            </FloatingLabel>
          </InputGroup>
        </Card.Body>
        <Card.Footer>
          <Button type="button" onClick={handleMove}>
            Move
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}

export { ActionMoveCard }
