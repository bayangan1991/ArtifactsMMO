import { useEffect, useState } from 'react'
import './App.scss'
import { faHandFist, faMoon, faTrowel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { useCharacter } from './artifactsmmo-client/hooks/use-character.ts'
import { useCharacters } from './artifactsmmo-client/hooks/use-characters.ts'
import { ActionMoveCard } from './components/action-move-card/action-move-card.tsx'
import { ActionStackCard } from './components/action-stack-card/ActionStackCard.tsx'
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
    {
      key: 'rest',
      label: (
        <>
          <Icon icon={faMoon} /> Rest
        </>
      ),
      variant: 'success',
      action: rest,
    },
    {
      key: 'fight',
      label: (
        <>
          <Icon icon={faHandFist} /> Fight
        </>
      ),
      variant: 'danger',
      action: fight,
    },
    {
      key: 'gather',
      label: (
        <>
          <Icon icon={faTrowel} /> Gather
        </>
      ),
      variant: 'warning',
      action: gathering,
    },
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
            <ActionMoveCard
              doMove={move}
              currentPosition={character ? { x: character.x, y: character.y } : undefined}
            />
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
