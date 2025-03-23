import { faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import type { Temporal } from '@js-temporal/polyfill'
import type React from 'react'
import { useMemo } from 'react'
import { Badge, Button, ButtonGroup, Card, Col, Container, ProgressBar, Row, Stack } from 'react-bootstrap'
import { Status } from '../../artifactsmmo-client/hooks/use-character.ts'
import { useMap } from '../../artifactsmmo-client/hooks/use-map.ts'
import type { components } from '../../artifactsmmo-client/spec'
import '@formatjs/intl-durationformat/polyfill'
import { StatusColour } from '../../constants.ts'

interface SimpleAction {
  key: string
  label: React.ReactNode
  variant: string
  action: () => void
  repeat?: () => void
}

interface Props {
  character: components['schemas']['CharacterSchema'] | null
  simpleActions?: SimpleAction[]
  lastAction: string | null
  error: string | null
  status: Status
  timeUntilReady: Temporal.Duration | null
  togglePause: () => void
}

const CharacterCard = ({
  character,
  simpleActions = [],
  status,
  lastAction,
  timeUntilReady,
  error,
  togglePause,
}: Props) => {
  const map = useMap(
    useMemo(() => {
      return {
        x: character?.x || 0,
        y: character?.y || 0,
      }
    }, [character?.x, character?.y])
  )

  const locationString = map && map.data.name + (map.data.content ? `[${map.data.content?.code}]` : '')

  return (
    <Card>
      <Card.Body className="d-flex flex-column gap-2">
        <Card.Title className="d-flex justify-content-between flex-column">
          <div className="d-flex justify-content-between align-items-between">
            <div>
              <Card.Img
                style={{ maxWidth: 20 }}
                src={`https://www.artifactsmmo.com/images/characters/${character?.skin}.png`}
                className="me-1"
              />
              {character?.name} <small className="text-muted">lvl{character?.level}</small>
            </div>
            <Badge style={{ textTransform: 'capitalize' }} bg={StatusColour[status]} onClick={togglePause}>
              {status !== Status.Cooldown && status}
              {status === Status.Cooldown && timeUntilReady?.round('seconds').toLocaleString()}
              {status === Status.Cooldown && !timeUntilReady && status}
            </Badge>
          </div>
          <div>
            <small className="text-muted">
              {character?.x},{character?.y}@{locationString}
            </small>
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
              <Col xs={3}>
                <Card.Img
                  style={{ maxWidth: 80 }}
                  src={`https://www.artifactsmmo.com/images/maps/${map?.data.skin}.png`}
                  alt={map?.data.content?.code}
                  title={map?.data.content?.code}
                />
              </Col>
              <Col>
                <Stack gap={2}>
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
                  <Stack gap={1} direction="horizontal">
                    <span>{lastAction || error}</span>
                  </Stack>
                </Stack>
              </Col>
            </Row>
          </Container>
        )}
      </Card.Body>
      <Card.Footer className="d-flex gap-2">
        {simpleActions.map((action) => (
          <ButtonGroup key={action.key} size="sm">
            <Button variant={action.variant} onClick={action.action}>
              {action.label}
            </Button>
            {action.repeat && (
              <Button variant={action.variant} onClick={action.repeat}>
                <Icon icon={faRepeat} />
              </Button>
            )}
          </ButtonGroup>
        ))}
      </Card.Footer>
    </Card>
  )
}

export { CharacterCard }
