import { useState } from 'react'
import { Button, Card, FloatingLabel, Form, InputGroup } from 'react-bootstrap'
import type { Position } from '../../../types.ts'

interface Props {
  doMove: (pos: Position) => void
}

const ActionMoveCard = ({ doMove }: Props) => {
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })

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
          <Button type="button" onClick={() => doMove(targetPos)}>
            Move
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}

export { ActionMoveCard }
