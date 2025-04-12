import { faMagnifyingGlass, faUserLargeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext, useMemo } from 'react'
import { Button, Card, Col, Container, ListGroup, ProgressBar, Row } from 'react-bootstrap'
import { useItem } from '../../../artifactsmmo-client/hooks/use-item.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import { ItemModalContext } from '../../../utils/contexts/modal/context.ts'

const SkillBar = ({
  character,
  skill,
}: {
  character: components['schemas']['CharacterSchema']
  skill: components['schemas']['Skill']
}) => (
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

interface SlotProps extends React.HTMLAttributes<HTMLDivElement> {
  character: components['schemas']['CharacterSchema']
  slot: components['schemas']['ItemSlot']
  unEquip(slot: components['schemas']['ItemSlot'], quantity?: number): void
}

const Slot = ({ character, slot, unEquip, ...rest }: SlotProps) => {
  const slotName: `${components['schemas']['ItemSlot']}_slot` = `${slot}_slot`
  const item = useItem(character[slotName])
  const { handleShow } = useContext(ItemModalContext)
  const slotQuantity = useMemo(() => {
    if (slot === 'utility1') return character.utility1_slot_quantity
    if (slot === 'utility2') return character.utility2_slot_quantity
    return 1
  }, [slot, character])

  if (!rest.style) rest.style = { minHeight: 120 }
  if (!rest.style.minHeight) rest.style.minHeight = 120

  return (
    <div {...rest} className="d-flex justify-content-around align-items-center border rounded flex-column">
      {item && character[slotName] && (
        <>
          <img src={`https://artifactsmmo.com/images/items/${item.code}.png`} height={40} alt={slot} />
          <div className="d-flex justify-content-between w-100 px-2">
            <Button size="sm" variant="outline-light" onClick={() => handleShow(item)}>
              <Icon icon={faMagnifyingGlass} />
            </Button>
            {slotQuantity > 1 && `x${slotQuantity}`}
            <Button onClick={() => unEquip(slot, slotQuantity)} size="sm" variant="outline-light">
              <Icon icon={faUserLargeSlash} />
            </Button>
          </div>
        </>
      )}
      {!character[slotName] && <small className="text-muted">{slot}</small>}
    </div>
  )
}

interface Props {
  character: components['schemas']['CharacterSchema']
  unEquip(slot: components['schemas']['ItemSlot'], quantity?: number): void
}

const Character = ({ character, unEquip }: Props) => (
  <Card>
    <Card.Body>
      <Container>
        <Row>
          <Col xs="auto">
            <h5>Equipment</h5>
            <div className="gap-1" style={{ display: 'grid', gridTemplateColumns: '130px 130px 130px' }}>
              <Slot unEquip={unEquip} character={character} style={{ gridColumnStart: 2 }} slot="helmet" />
              <Slot unEquip={unEquip} character={character} style={{ gridColumnStart: 1 }} slot="utility1" />
              <Slot unEquip={unEquip} character={character} slot="amulet" />
              <Slot unEquip={unEquip} character={character} slot="utility2" />
              <Slot unEquip={unEquip} character={character} slot="weapon" />
              <Slot unEquip={unEquip} character={character} slot="body_armor" />
              <Slot unEquip={unEquip} character={character} slot="shield" />
              <Slot unEquip={unEquip} character={character} slot="ring1" />
              <Slot unEquip={unEquip} character={character} slot="leg_armor" />
              <Slot unEquip={unEquip} character={character} slot="ring2" />
              <Slot unEquip={unEquip} character={character} slot="rune" />
              <Slot unEquip={unEquip} character={character} slot="boots" />
              <Slot unEquip={unEquip} character={character} slot="bag" />
              <Slot unEquip={unEquip} character={character} slot="artifact1" />
              <Slot unEquip={unEquip} character={character} slot="artifact2" />
              <Slot unEquip={unEquip} character={character} slot="artifact3" />
            </div>
          </Col>
          <Col>
            <h5>Skills</h5>
            <ListGroup>
              <ListGroup.Item>
                <SkillBar character={character} skill="mining" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="woodcutting" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="fishing" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="weaponcrafting" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="gearcrafting" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="jewelrycrafting" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="cooking" />
              </ListGroup.Item>
              <ListGroup.Item>
                <SkillBar character={character} skill="alchemy" />
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </Card.Body>
  </Card>
)

export { Character }
