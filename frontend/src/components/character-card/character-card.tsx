import { faHandFist, faMoon, faRepeat, faTrowel } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useMemo } from 'react'
import { Badge, Button, ButtonGroup, Card, Col, Container, ProgressBar, Row, Stack } from 'react-bootstrap'
import { Status } from '../../artifactsmmo-client/hooks/use-character.ts'
import { useMap } from '../../artifactsmmo-client/hooks/use-map.ts'
import '@formatjs/intl-durationformat/polyfill'
import { StatusColour } from '../../constants.ts'
import type {
  BankGoldTransaction,
  BankTransactionData,
  EquipmentData,
  FightData,
  MovementData,
  RestData,
  SkillData,
} from '../../types.ts'
import { useCharacterContext } from '../../utils/contexts/character/context.ts'
import { isActionType } from '../../utils/is-action-type.ts'
import { Item } from '../item/item.tsx'

const CharacterCard = () => {
  const {
    character,
    actions: { rest, fight, gathering },
    lastAction,
    timeUntilReady,
    error,
    togglePause,
    status,
  } = useCharacterContext()

  const map = useMap(
    useMemo(() => {
      return {
        x: character?.x || 0,
        y: character?.y || 0,
      }
    }, [character])
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
    },
  ]

  const lastActionResult: React.ReactNode = useMemo(() => {
    if (!lastAction) return ''
    if (isActionType<MovementData>(lastAction, 'movement')) {
      return `Moving to ${lastAction.destination.name}`
    }
    if (isActionType<FightData>(lastAction, 'fight')) {
      return (
        <>
          Fight: {lastAction.fight.result}
          {!!lastAction.fight.drops.length && '. Found: '}
          {lastAction.fight.drops.map((item) => (
            <div className="me-1 d-inline-block" key={item.code}>
              <Item code={item.code} /> <small className="text-muted">x{item.quantity}</small>
            </div>
          ))}
        </>
      )
    }
    if (isActionType<SkillData>(lastAction, 'gathering')) {
      return (
        <>
          Gathered{' '}
          {lastAction.details.items.map((item) => (
            <div className="ms-1 d-inline-block" key={item.code}>
              <Item code={item.code} />
              <small className="text-muted"> x{item.quantity}</small>
            </div>
          ))}
        </>
      )
    }
    if (isActionType<RestData>(lastAction, 'rest')) {
      return `Restored ${lastAction.hp_restored}hp`
    }
    if (isActionType<BankGoldTransaction>(lastAction, ['withdraw_gold', 'deposit_gold'])) {
      return `Bank gold updated. New amount: ${lastAction.bank.quantity.toLocaleString()}`
    }
    if (isActionType<BankTransactionData>(lastAction, 'withdraw')) {
      return (
        <>
          <Item code={lastAction.item.code} /> withdrawn
        </>
      )
    }
    if (isActionType<BankTransactionData>(lastAction, 'deposit')) {
      return (
        <>
          <Item code={lastAction.item.code} /> deposited
        </>
      )
    }
    if (isActionType<EquipmentData>(lastAction, ['equip', 'unequip'])) {
      return (
        <>
          <Item code={lastAction.item.code} /> {lastAction.cooldown.reason}ped
        </>
      )
    }
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
            <Button variant={action.variant} onClick={() => action.action()}>
              {action.label}
            </Button>
            <Button variant={action.variant} onClick={() => action.action({ requeue: true })}>
              <Icon icon={faRepeat} />
            </Button>
          </ButtonGroup>
        ))}
      </Card.Footer>
    </Card>
  )
}

export { CharacterCard }
