import { faMagnifyingGlass, faUserLargeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { Button, Card, Col, Container, ListGroup, ProgressBar, Row } from 'react-bootstrap'
import { useItem } from '../../../artifactsmmo-client/hooks/use-item.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import { ItemModalContext } from '../../../utils/contexts/modal/context.ts'
interface Props {
  character: components['schemas']['CharacterSchema']
}

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
}

const Slot = ({ character, slot, ...rest }: SlotProps) => {
  const slotName: `${components['schemas']['ItemSlot']}_slot` = `${slot}_slot`
  const item = useItem(character[slotName])
  const { handleShow } = useContext(ItemModalContext)

  if (!rest.style) rest.style = { minHeight: 100 }
  if (!rest.style.minHeight) rest.style.minHeight = 100

  return (
    <div {...rest} className="d-flex justify-content-around align-items-center border rounded flex-column">
      {item && character[slotName] && (
        <>
          <img src={`https://artifactsmmo.com/images/items/${item.code}.png`} height={40} alt={slot} />
          <div className="d-flex justify-content-between w-100 px-2">
            <Button size="sm" variant="outline-light" onClick={() => handleShow(item)}>
              <Icon icon={faMagnifyingGlass} />
            </Button>
            <Button size="sm" variant="outline-light">
              <Icon icon={faUserLargeSlash} />
            </Button>
          </div>
        </>
      )}
      {!character[slotName] && <small className="text-muted">{slot}</small>}
    </div>
  )
}

const Character = ({ character }: Props) => (
  <Card>
    <Card.Body>
      <Container>
        <Row>
          <Col xs="auto">
            <h5>Equipment</h5>
            <div className="gap-1" style={{ display: 'grid', gridTemplateColumns: '100px 100px 100px' }}>
              <Slot character={character} style={{ gridColumnStart: 2 }} slot="helmet" />
              <Slot character={character} style={{ gridColumnStart: 1 }} slot="utility1" />
              <Slot character={character} slot="amulet" />
              <Slot character={character} slot="utility2" />
              <Slot character={character} slot="weapon" />
              <Slot character={character} slot="body_armor" />
              <Slot character={character} slot="shield" />
              <Slot character={character} slot="ring1" />
              <Slot character={character} slot="leg_armor" />
              <Slot character={character} slot="ring2" />
              <Slot character={character} slot="rune" />
              <Slot character={character} slot="boots" />
              <Slot character={character} slot="bag" />
              <Slot character={character} slot="artifact1" />
              <Slot character={character} slot="artifact2" />
              <Slot character={character} slot="artifact3" />
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
