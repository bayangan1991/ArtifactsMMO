import { faMagnifyingGlass, faUserLargeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext, useMemo } from 'react'
import { Button, Card, Col, Container, ListGroup, ProgressBar, Row } from 'react-bootstrap'
import { useItem } from '../../../artifactsmmo-client/hooks/use-item.ts'
import { useMonster } from '../../../artifactsmmo-client/hooks/use-monster.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import { useCharacterContext } from '../../../utils/contexts/character/context.ts'
import { ItemModalContext } from '../../../utils/contexts/modal/context.ts'

const SkillBar = ({
  skill,
}: {
  skill: components['schemas']['Skill']
}) => {
  const { character } = useCharacterContext()

  if (!character) return

  return (
    <div className="d-flex flex-column gap-1">
      <div className="d-flex justify-content-between">
        <span>
          {skill} <small className="text-muted">@ lvl{character[`${skill}_level`]}</small>
        </span>
        <span>
          {character[`${skill}_xp`]}/{character[`${skill}_max_xp`]}
        </span>
      </div>
      <ProgressBar now={character[`${skill}_xp`]} max={character[`${skill}_max_xp`]} />
    </div>
  )
}

interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  slot: components['schemas']['ItemSlot']
}

const Slot = ({ slot, ...rest }: SlotProps) => {
  const { handleShow } = useContext(ItemModalContext)
  const {
    character,
    actions: { unEquip },
  } = useCharacterContext()
  const slotName: `${components['schemas']['ItemSlot']}_slot` = `${slot}_slot`
  const slotItem = character ? character[slotName] : null
  const item = useItem(slotItem)

  const slotQuantity = useMemo(() => {
    if (character && slot === 'utility1') return character.utility1_slot_quantity
    if (character && slot === 'utility2') return character.utility2_slot_quantity
    return 1
  }, [slot, character])

  if (!rest.style) rest.style = { minHeight: 120 }
  if (!rest.style.minHeight) rest.style.minHeight = 120

  if (!character) return

  return (
    <div {...rest} className="d-flex justify-content-around align-items-center border rounded flex-column">
      {item && slotItem && (
        <>
          <img src={`https://artifactsmmo.com/images/items/${item.code}.png`} height={40} alt={slot} />
          <div className="d-flex justify-content-between w-100 px-2">
            <Button size="sm" variant="outline-light" onClick={() => handleShow(item)}>
              <Icon icon={faMagnifyingGlass} />
            </Button>
            {slotQuantity > 1 && `x${slotQuantity}`}
            <Button onClick={() => unEquip({ slot, quantity: slotQuantity })} size="sm" variant="outline-light">
              <Icon icon={faUserLargeSlash} />
            </Button>
          </div>
        </>
      )}
      {!slotItem && <small className="text-muted">{slot}</small>}
    </div>
  )
}

const TaskDetail = () => {
  const {
    character,
    actions: { taskAbandon },
  } = useCharacterContext()
  const monster = useMonster(character?.task || '')
  const item = useItem(character?.task || '')

  if (!character || !character.task) return

  return (
    <div className="mb-3">
      <h5>Active Task</h5>
      <div className="d-flex justify-content-between align-items-end">
        {character.task_type === 'monsters' && monster && (
          <>
            Slay {character.task_total} {monster.name}
          </>
        )}
        {character.task_type === 'items' && item && (
          <>
            Deliver {character.task_total} {item.name}
          </>
        )}
        <Button variant="outline-danger" size="sm" onClick={() => taskAbandon()}>
          Abandon
        </Button>
      </div>
      <ProgressBar
        className="mt-1"
        variant="warning"
        now={character.task_progress}
        max={character.task_total}
        label={character.task_progress}
      />
    </div>
  )
}

const Character = () => {
  return (
    <Card>
      <Card.Body>
        <Container fluid>
          <Row>
            <Col xs="auto">
              <h5>Equipment</h5>
              <div className="gap-1" style={{ display: 'grid', gridTemplateColumns: '130px 130px 130px' }}>
                <Slot style={{ gridColumnStart: 2 }} slot="helmet" />
                <Slot style={{ gridColumnStart: 1 }} slot="utility1" />
                <Slot slot="amulet" />
                <Slot slot="utility2" />
                <Slot slot="weapon" />
                <Slot slot="body_armor" />
                <Slot slot="shield" />
                <Slot slot="ring1" />
                <Slot slot="leg_armor" />
                <Slot slot="ring2" />
                <Slot slot="rune" />
                <Slot slot="boots" />
                <Slot slot="bag" />
                <Slot slot="artifact1" />
                <Slot slot="artifact2" />
                <Slot slot="artifact3" />
              </div>
            </Col>
            <Col>
              <TaskDetail />
              <h5>Skills</h5>
              <ListGroup>
                <ListGroup.Item>
                  <SkillBar skill="mining" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="woodcutting" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="fishing" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="weaponcrafting" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="gearcrafting" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="jewelrycrafting" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="cooking" />
                </ListGroup.Item>
                <ListGroup.Item>
                  <SkillBar skill="alchemy" />
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  )
}

export { Character }
