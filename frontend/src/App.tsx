import { useEffect, useState } from 'react'
import './App.scss'
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { Status, useCharacter } from './artifactsmmo-client/hooks/use-character.ts'
import { useCharacters } from './artifactsmmo-client/hooks/use-characters.ts'
import { ActionStackCard } from './components/action-stack-card/ActionStackCard.tsx'
import { ActionMoveCard } from './components/actions/action-move-card/ActionMoveCard.tsx'
import { InventoryCard } from './components/inventory-card/inventory-card.tsx'
import { StatsCard } from './components/stats-card/StatsCard.tsx'

function App() {
  const characters = useCharacters()
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)

  const {
    character,
    actions: { move, rest, fight, deposit, withdraw, gathering },
    lastAction,
    status,
    timeUntilReady,
    actionQueue,
  } = useCharacter(activeCharacter)

  useEffect(() => {
    if (characters.length) {
      setActiveCharacter(characters[0])
    }
  }, [characters])

  const simpleActions = [
    { label: 'Rest', variant: 'success', action: rest },
    { label: 'Fight', variant: 'danger', action: fight },
    { label: 'Gathering', variant: 'warning', action: gathering },
  ]
  return (
    <>
      <Navbar data-bs-theme="dark" bg="dark" fixed="top">
        <Container fluid className="gap-2">
          <Navbar.Brand>
            {activeCharacter} <small className="text-muted">lvl{character?.level}</small>
          </Navbar.Brand>
          <div className="me-auto d-flex gap-2">
            <Navbar.Text>
              @{character?.x},{character?.y}
            </Navbar.Text>
          </div>
          <Navbar.Text>{lastAction}</Navbar.Text>
          <Navbar.Text>
            {timeUntilReady?.round('second').toLocaleString()}
            {status !== Status.Cooldown && status}
          </Navbar.Text>
        </Container>
      </Navbar>
      <Container fluid className="mt-3">
        <Row className="g-4">
          <Col lg={3} className="d-flex gap-2 flex-column">
            <StatsCard character={character} simpleActions={simpleActions} />
            <ActionMoveCard doMove={move} />
            {actionQueue.length > 0 && <ActionStackCard queue={actionQueue} />}
          </Col>
          <Col lg={9} className="d-flex gap-2 flex-column">
            {character && <InventoryCard character={character} depositItem={deposit} withdrawItem={withdraw} />}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
