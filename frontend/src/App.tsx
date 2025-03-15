import { useEffect, useState } from 'react'
import './App.scss'
import { Temporal } from '@js-temporal/polyfill'
import { Button, Card, Col, Container, Form, Navbar, Row } from 'react-bootstrap'
import { useCharacters, usePosition } from './artifactsmmo-client/client.ts'
import { useInterval } from './hooks/use-interval.ts'
import type { Position } from './types.ts'

function App() {
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const characters = useCharacters()
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)

  useEffect(() => {
    if (characters.length) setActiveCharacter(characters[0])
  }, [characters])

  const { pos, move } = usePosition(activeCharacter)
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })

  const [timeUntilReady, setTimeUntilReady] = useState<Temporal.Duration | null>(null)

  const onTick = () => {
    const ready = Temporal.Instant.compare(Temporal.Now.instant(), cooldown) !== -1
    if (ready) setTimeUntilReady(null)
    if (!ready) setTimeUntilReady(Temporal.Now.instant().until(cooldown))
  }
  useInterval(onTick, 100)

  const handleMove = (pos: Position) => {
    move(pos).then((result) => {
      if (result) {
        setCooldown(Temporal.Instant.from(result.cooldown.expiration))
      }
    })
  }

  return (
    <>
      <Navbar data-bs-theme="dark" bg="dark">
        <Container fluid>
          <Navbar.Brand>{activeCharacter}</Navbar.Brand>
          <div className="me-auto d-flex gap-2">
            <Navbar.Text>
              @{pos.x},{pos.y}
            </Navbar.Text>
          </div>
          <Navbar.Text>
            {timeUntilReady?.round('second').toLocaleString()}
            {!timeUntilReady && 'Ready'}
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container fluid className="mt-3">
        <Row>
          <Col lg={3}>
            <Card>
              <Form>
                <Card.Body>
                  <Card.Title>Move Action</Card.Title>
                  <Form.Group>
                    <Form.Label>X</Form.Label>
                    <Form.Control
                      type="number"
                      value={targetPos.x}
                      onChange={(e) => setTargetPos({ y: targetPos.y, x: Number(e.target.value) })}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Y</Form.Label>
                    <Form.Control
                      type="number"
                      value={targetPos.y}
                      onChange={(e) => setTargetPos({ x: targetPos.x, y: Number(e.target.value) })}
                    />
                  </Form.Group>
                </Card.Body>
                <Card.Footer>
                  <Button type="button" onClick={() => handleMove(targetPos)}>
                    Move
                  </Button>
                </Card.Footer>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
