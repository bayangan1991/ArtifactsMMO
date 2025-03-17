import type { Temporal } from '@js-temporal/polyfill'
import { useMemo } from 'react'
import { Button, Card, Col, Container, ProgressBar, Row } from 'react-bootstrap'
import { Status } from '../../artifactsmmo-client/hooks/use-character.ts'
import { useMap } from '../../artifactsmmo-client/hooks/use-map.ts'
import type { components } from '../../artifactsmmo-client/spec'

interface SimpleAction {
  label: string
  variant: string
  action: () => void
}

interface Props {
  character: components['schemas']['CharacterSchema'] | null
  simpleActions?: SimpleAction[]
  lastAction: string | null
  status: Status
  timeUntilReady: Temporal.Duration | null
}

const StatsCard = ({ character, simpleActions = [], status, lastAction, timeUntilReady }: Props) => {
  const map = useMap(
    useMemo(() => {
      return {
        x: character?.x || 0,
        y: character?.y || 0,
      }
    }, [character?.x, character?.y])
  )

  return (
    <Card>
      <Card.Body className="d-flex flex-column gap-2">
        <Card.Title className="d-flex align-items-center justify-content-between">
          <div>
            <Card.Img
              style={{ maxWidth: 20 }}
              src={`https://www.artifactsmmo.com/images/characters/${character?.skin}.png`}
            />
            {character?.name} <small className="text-muted">lvl{character?.level}</small>
          </div>
          <div>
            @{character?.x},{character?.y}
          </div>
        </Card.Title>
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
              <Col xxl={3}>
                <Card.Img
                  style={{ maxWidth: 80 }}
                  src={`https://www.artifactsmmo.com/images/maps/${map?.data.skin}.png`}
                />
              </Col>
              <Col>
                <div className="d-flex flex-column gap-2">
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
                  <div className="d-flex justify-content-between">
                    <span>{lastAction}</span>
                    {status !== Status.Cooldown && status}
                    {status === Status.Cooldown && timeUntilReady?.round('second').toLocaleString()}
                  </div>
                </div>
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
}

export { StatsCard }
