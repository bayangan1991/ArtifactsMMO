import { useEffect, useMemo, useState } from 'react'
import './App.scss'
import { faHandFist, faMoon, faTrowel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Col, Container, Navbar, Row } from 'react-bootstrap'
import { useCharacter } from './artifactsmmo-client/hooks/use-character.ts'
import { useCharacters } from './artifactsmmo-client/hooks/use-characters.ts'
import { ActionCard } from './components/action-card/action-card.tsx'
import { ActionQueueCard } from './components/action-queue-card/action-queue-card.tsx'
import { CharacterCard } from './components/character-card/character-card.tsx'
import { InventoryCard } from './components/inventory-card/inventory-card.tsx'
import { type FightData, type MovementData, type RestData, type SkillData, isActionType } from './types.ts'

function App() {
  const characters = useCharacters('Bayangan')
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)

  const {
    character,
    actions: { move, rest, repeatRest, fight, repeatFight, deposit, withdraw, gathering, repeatGathering, craft },
    lastAction,
    error,
    status,
    timeUntilReady,
    actionQueue,
  } = useCharacter(activeCharacter)

  useEffect(() => {
    if (characters.length > 0) {
      setActiveCharacter(characters[0])
    }
  }, [characters])

  const lastActionResult: string = useMemo(() => {
    if (!lastAction) return ''
    if (isActionType<FightData>(lastAction, 'fight')) {
      const loot = lastAction.fight.drops.map((item) => `${item.code} x ${item.quantity}`).join(', ')
      return `${lastAction.fight.result} fight${loot ? `, found: ${loot}` : ''}`
    }
    if (isActionType<MovementData>(lastAction, 'movement')) {
      return `Moving to ${lastAction.destination.name}`
    }
    if (isActionType<SkillData>(lastAction, 'gathering')) {
      return `Gathered ${lastAction.details.items.map((item) => `${item.code} x ${item.quantity}`).join(', ')}`
    }
    if (isActionType<RestData>(lastAction, 'rest')) {
      return `Restored ${lastAction.hp_restored}hp`
    }

    return lastAction.cooldown.reason
  }, [lastAction])

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
      repeat: repeatRest,
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
      repeat: repeatFight,
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
      repeat: repeatGathering,
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
          <Col lg={4} className="d-flex gap-2 flex-column">
            <CharacterCard
              character={character}
              simpleActions={simpleActions}
              status={status}
              lastAction={lastActionResult}
              error={error ?? null}
              timeUntilReady={timeUntilReady}
            />
            <ActionCard
              move={move}
              craft={craft}
              currentPosition={character ? { x: character.x, y: character.y } : undefined}
            />
            {actionQueue.size() > 0 && <ActionQueueCard queue={actionQueue.data()} handleRemove={actionQueue.remove} />}
          </Col>
          <Col lg={8} className="d-flex gap-2 flex-column">
            {character && <InventoryCard character={character} depositItem={deposit} withdrawItem={withdraw} />}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default App
