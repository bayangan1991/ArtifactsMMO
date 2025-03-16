import { useEffect, useState } from 'react'
import './App.scss'
import { Temporal } from '@js-temporal/polyfill'
import { Card, Col, Container, Navbar, Row } from 'react-bootstrap'
import { useCharacter } from './artifactsmmo-client/hooks/use-characters/useCharacter.ts'
import { useCharacters } from './artifactsmmo-client/hooks/use-characters/useCharacters.ts'
import { ActionMoveCard } from './components/actions/action-move-card/ActionMoveCard.tsx'
import { StatsCard } from './components/stats-card/StatsCard.tsx'
import { useInterval } from './hooks/use-interval.ts'
import { useStack } from './hooks/use-stack.ts'
import type { Queue } from './types.ts'

function ActionStackCard(props: { queue: Queue[] }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Action Stack</Card.Title>
        <ol>
          {props.queue.map((item) => (
            <li key={item.guid.toJSON()}>{item.label}</li>
          ))}
        </ol>
      </Card.Body>
    </Card>
  )
}

function App() {
  const characters = useCharacters()
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const [timeUntilReady, setTimeUntilReady] = useState<Temporal.Duration | null>(null)
  const { stack: actionStack, pushRight, popLeft } = useStack<Queue>()
  const [lastAction, setLastAction] = useState<string | null>(null)

  const ready = timeUntilReady === null

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

  const onTick = () => {
    const ready = Temporal.Instant.compare(Temporal.Now.instant(), cooldown) > -1
    if (ready) {
      setTimeUntilReady(null)
    }
    if (!ready) setTimeUntilReady(Temporal.Now.instant().until(cooldown))
  }
  useInterval(onTick, 100)

  useEffect(() => {
    if (ready) {
      const queuedAction = popLeft()
      if (queuedAction) {
        const tempCooldown = Temporal.Now.instant().add(Temporal.Duration.from('PT10S'))
        setCooldown(tempCooldown)
        setTimeUntilReady(Temporal.Now.instant().until(tempCooldown))
        queuedAction.action()
        setLastAction(queuedAction.label)
      }
    }
  }, [ready, popLeft])

  const queueAction = (queue: Queue) => {
    if (actionStack.length === 0 && ready) {
      queue.action()
      setLastAction(queue.label)
      setCooldown(Temporal.Now.instant().add(Temporal.Duration.from('PT10S')))
      setTimeUntilReady(Temporal.Now.instant().until(cooldown))
    } else {
      pushRight(queue)
    }
  }

  return (
    <>
      <Navbar data-bs-theme="dark" bg="dark">
        <Container fluid className="gap-2">
          <Navbar.Brand>{activeCharacter}</Navbar.Brand>
          <div className="me-auto d-flex gap-2">
            <Navbar.Text>
              @{character?.x},{character?.y}
            </Navbar.Text>
          </div>
          <Navbar.Text>{lastAction}</Navbar.Text>
          <Navbar.Text>
            {timeUntilReady?.round('second').toLocaleString()}
            {!timeUntilReady && 'Ready'}
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container fluid className="mt-3">
        <Row className="g-4">
          <Col lg={6}>
            <Row>
              <Col>{actionStack.length > 0 && <ActionStackCard queue={actionStack} />}</Col>
            </Row>
            <Row>
              <Col>
                <StatsCard character={character} doRest={rest} queueAction={queueAction} />
              </Col>
            </Row>
          </Col>
          <Col lg={6}>
            <ActionMoveCard doMove={move} queueAction={queueAction} />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
