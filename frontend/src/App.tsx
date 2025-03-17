import { useEffect, useState } from 'react'
import './App.scss'
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { useCharacter } from './artifactsmmo-client/hooks/use-character.ts'
import { useCharacters } from './artifactsmmo-client/hooks/use-characters.ts'
import { ActionStackCard } from './components/action-stack-card/ActionStackCard.tsx'
import { ActionMoveCard } from './components/actions/action-move-card/ActionMoveCard.tsx'
import { CharacterCard } from './components/character-card/CharacterCard.tsx'
import { InventoryCard } from './components/inventory-card/inventory-card.tsx'

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
    if (characters.length > 0) {
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
          <Navbar.Brand>Artifacts MMO Client</Navbar.Brand>
        </Container>
      </Navbar>
      <Container fluid className="mt-3">
        <Row className="g-4">
          <Col lg={3} className="d-flex gap-2 flex-column">
            <CharacterCard
              character={character}
              simpleActions={simpleActions}
              status={status}
              lastAction={lastAction}
              timeUntilReady={timeUntilReady}
            />
            <ActionMoveCard doMove={move} />
            {actionQueue.size() > 0 && <ActionStackCard queue={actionQueue.data()} />}
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
