import { faHandFist, faMoon, faTrowel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useMemo } from 'react'
import { Col, Container, Row } from 'react-bootstrap'

import { useCharacter } from '../../artifactsmmo-client/hooks/use-character.ts'
import { ActionCard } from '../action-card/action-card.tsx'
import { ActionQueueCard } from '../action-queue-card/action-queue-card.tsx'
import { CharacterCard } from '../character-card/character-card.tsx'
import { InventoryCard } from '../inventory-card/inventory-card.tsx'

import type { FightData, MovementData, RestData, SkillData } from '../../types.ts'
import { CharacterContext } from '../../utils/contexts/character/context.ts'
import { isActionType } from '../../utils/is-action-type.ts'

interface Props {
  characterName: string
}

const CharacterView = ({ characterName }: Props) => {
  const character = useCharacter(characterName || null)

  const lastActionResult: string = useMemo(() => {
    if (!character.lastAction) return ''
    if (isActionType<FightData>(character.lastAction, 'fight')) {
      const loot = character.lastAction.fight.drops.map((item) => `${item.code} x ${item.quantity}`).join(', ')
      return `${character.lastAction.fight.result} fight${loot ? `, found: ${loot}` : ''}`
    }
    if (isActionType<MovementData>(character.lastAction, 'movement')) {
      return `Moving to ${character.lastAction.destination.name}`
    }
    if (isActionType<SkillData>(character.lastAction, 'gathering')) {
      return `Gathered ${character.lastAction.details.items.map((item) => `${item.code} x ${item.quantity}`).join(', ')}`
    }
    if (isActionType<RestData>(character.lastAction, 'rest')) {
      return `Restored ${character.lastAction.hp_restored}hp`
    }

    return character.lastAction.cooldown.reason
  }, [character.lastAction])

  const simpleActions = [
    {
      key: 'rest',
      label: (
        <>
          <Icon icon={faMoon} /> Rest
        </>
      ),
      variant: 'success',
      action: character.actions.rest,
      repeat: character.actions.repeatRest,
    },
    {
      key: 'fight',
      label: (
        <>
          <Icon icon={faHandFist} /> Fight
        </>
      ),
      variant: 'danger',
      action: character.actions.fight,
      repeat: character.actions.repeatFight,
    },
    {
      key: 'gather',
      label: (
        <>
          <Icon icon={faTrowel} /> Gather
        </>
      ),
      variant: 'warning',
      action: character.actions.gathering,
      repeat: character.actions.repeatGathering,
    },
  ]

  return (
    <CharacterContext.Provider value={character}>
      <Container fluid>
        <Row className="g-4">
          <Col md={6} lg={4} className="d-flex gap-2 flex-column">
            <CharacterCard
              character={character.character}
              simpleActions={simpleActions}
              status={character.status}
              lastAction={lastActionResult}
              error={character.error ?? null}
              timeUntilReady={character.timeUntilReady}
              togglePause={character.togglePause}
            />
            <ActionCard
              move={character.actions.move}
              craft={character.actions.craft}
              depositAll={character.actions.depositAll}
              currentPosition={character.character ? { x: character.character.x, y: character.character.y } : undefined}
            />
            {character.actionQueue.size() > 0 && (
              <ActionQueueCard queue={character.actionQueue.data()} handleRemove={character.actionQueue.remove} />
            )}
          </Col>
          <Col className="d-flex gap-2 flex-column">
            {character.character && (
              <InventoryCard
                character={character.character}
                depositItem={character.actions.deposit}
                withdrawItem={character.actions.withdraw}
                unEquip={character.actions.unEquip}
                equip={character.actions.equip}
              />
            )}
          </Col>
        </Row>
      </Container>
    </CharacterContext.Provider>
  )
}

export { CharacterView }
