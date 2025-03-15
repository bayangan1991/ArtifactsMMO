import { useEffect, useState } from 'react'
import './App.scss'
import { Temporal } from '@js-temporal/polyfill'
import { Button, Card, Col, Container, Form, Navbar, ProgressBar, Row } from 'react-bootstrap'
import { useCharacter } from './artifactsmmo-client/hooks/use-characters/useCharacter.ts'
import { useCharacters } from './artifactsmmo-client/hooks/use-characters/useCharacters.ts'
import { useInterval } from './hooks/use-interval.ts'
import type { Position } from './types.ts'

function App() {
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const [timeUntilReady, setTimeUntilReady] = useState<Temporal.Duration | null>(null)
  const characters = useCharacters()
  const {
    character,
    actions: { move, rest },
  } = useCharacter(activeCharacter)

  useEffect(() => {
    if (characters.length) {
      setActiveCharacter(characters[0])
    }
  }, [characters])

  useEffect(() => {
    if (character) {
      if (character.cooldown_expiration) setCooldown(Temporal.Instant.from(character.cooldown_expiration))
    }
  }, [character])

  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })

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
              @{character?.x},{character?.y}
            </Navbar.Text>
          </div>
          <Navbar.Text>
            {timeUntilReady?.round('second').toLocaleString()}
            {!timeUntilReady && 'Ready'}
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container fluid className="mt-3">
        <Row className="g-4">
          <Col lg={6}>
            <Card>
              <Card.Body>
                <ProgressBar variant="danger" max={character?.max_hp} now={character?.hp} />
              </Card.Body>
              <Card.Footer>
                <Button variant="danger" onClick={rest}>
                  Rest
                </Button>
              </Card.Footer>
            </Card>
          </Col>
          <Col lg={6}>
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
