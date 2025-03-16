import { Button, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap'
import type { components } from '../../artifactsmmo-client/spec'

interface SimpleAction {
  label: string
  variant: string
  action: () => void
}

interface Props {
  character: components['schemas']['CharacterSchema'] | null
  simpleActions?: SimpleAction[]
}

const StatsCard = ({ character, simpleActions = [] }: Props) => (
  <Card>
    <Card.Body className="d-flex flex-column gap-2">
      <Card.Title>Stats</Card.Title>
      {!character && (
        <Container>
          <Row>
            <Col lg={3} />
            <Col className="d-flex flex-column gap-2">
              <ProgressBar variant="danger" striped animated now={100} label="Loading..." />
              <ProgressBar variant="success" striped animated now={100} label="Loading..." />
            </Col>
          </Row>
        </Container>
      )}
      {character && (
        <Container>
          <Row>
            <Col lg={3}>
              <Card.Img height={80} src={`https://www.artifactsmmo.com/images/characters/${character.skin}.png`} />
            </Col>
            <Col className="d-flex flex-column gap-2">
              <ProgressBar
                variant="danger"
                max={character?.max_hp}
                now={character?.hp}
                label={`${character?.hp} / ${character?.max_hp}`}
              />
              <ProgressBar
                variant="success"
                max={character?.max_xp}
                now={character?.xp}
                label={`${character?.xp} / ${character?.max_xp}`}
              />
            </Col>
          </Row>
        </Container>
      )}
    </Card.Body>
    <Card.Footer className="d-flex gap-2">
      {simpleActions.map((action) => (
        <Button key={action.label} variant={action.variant} onClick={action.action}>
          {action.label}
        </Button>
      ))}
    </Card.Footer>
  </Card>
)

export { StatsCard }
