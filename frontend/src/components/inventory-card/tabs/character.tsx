import { Card, Col, Container, ListGroup, ProgressBar, Row } from 'react-bootstrap'
import type { components } from '../../../artifactsmmo-client/spec'

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

const Slot = ({
  character,
  slot,
}: { character: components['schemas']['CharacterSchema']; slot: components['schemas']['ItemSlot'] }) => {
  const slotName: `${components['schemas']['ItemSlot']}_slot` = `${slot}_slot`

  return (
    <div>
      {!!character[slotName] && (
        <img src={`https://artifactsmmo.com/images/items/${character[slotName]}.png`} alt={slot} />
      )}
      {!character[slotName] && slot}
    </div>
  )
}

const Character = ({ character }: Props) => (
  <Card>
    <Card.Body>
      <Container>
        <Row>
          <Col xs={4}>
            <h5>Equipment</h5>
            <Container>
              <Row>
                <Col xs={3}>
                  <Slot character={character} slot="utility1" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="helmet" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="utility2" />
                </Col>

                <Col xs={3}>
                  <Slot character={character} slot="amulet" />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <Slot character={character} slot="weapon" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="body_armor" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="shield" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="artifact1" />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <Slot character={character} slot="ring1" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="leg_armor" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="ring2" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="artifact2" />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <Slot character={character} slot="rune" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="boots" />
                </Col>
                <Col xs={3}>
                  <Slot character={character} slot="bag" />
                </Col>{' '}
                <Col xs={3}>
                  <Slot character={character} slot="artifact3" />
                </Col>
              </Row>
            </Container>
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
