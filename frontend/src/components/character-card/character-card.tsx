import { faHandFist, faMoon, faRepeat, faTrowel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { useMemo } from 'react'
import { Badge, Button, ButtonGroup, Card, Col, Container, ProgressBar, Row, Stack } from 'react-bootstrap'
import { Status } from '../../artifactsmmo-client/hooks/use-character.ts'
import { useMap } from '../../artifactsmmo-client/hooks/use-map.ts'
import '@formatjs/intl-durationformat/polyfill'
import { StatusColour } from '../../constants.ts'
import type { FightData, MovementData, RestData, SkillData } from '../../types.ts'
import { CharacterContext } from '../../utils/contexts/character/context.ts'
import { isActionType } from '../../utils/is-action-type.ts'

const CharacterCard = () => {
  const {
    character,
    actions: { rest, repeatRest, fight, repeatFight, gathering, repeatGathering },
    lastAction,
    timeUntilReady,
    error,
    togglePause,
    status,
  } = useContext(CharacterContext)
  const map = useMap(
    useMemo(() => {
      return {
        x: character?.x || 0,
        y: character?.y || 0,
      }
    }, [character?.x, character?.y])
  )

  const locationString = map && map.data.name + (map.data.content ? `[${map.data.content?.code}]` : '')

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
                    <span>{lastActionResult || error}</span>
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
