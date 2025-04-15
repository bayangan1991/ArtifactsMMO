import { faCoins, faHammer, faPersonHiking, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import { Accordion, Button, ButtonGroup, Card, Dropdown, Form, InputGroup, ListGroup, Stack } from 'react-bootstrap'
import { useItems } from '../../artifactsmmo-client/hooks/use-items.ts'
import { useMaps } from '../../artifactsmmo-client/hooks/use-maps.ts'
import { useMonster } from '../../artifactsmmo-client/hooks/use-monster.ts'
import { useResource } from '../../artifactsmmo-client/hooks/use-resource.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { RESOURCE_TYPES } from '../../constants.ts'
import { BankItemsContext } from '../../utils/contexts/bank-items/context.ts'
import { CharacterContext } from '../../utils/contexts/character/context.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { CharacterEffect } from '../character-effect/character-effect.tsx'
import { Item } from '../item/item.tsx'
import { Pagination } from '../pagination/pagination.tsx'

const CraftControl = ({
  code,
  craft,
}: { code: string; craft: (code: string, quantity: number, requeue?: boolean) => void }) => {
  const [quantity, setQuantity] = useState(1)

  return (
    <InputGroup size="sm" style={{ width: 120 }}>
      <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <Button onClick={() => craft(code, quantity)}>
        <Icon icon={faHammer} />
      </Button>
      <Button onClick={() => craft(code, quantity, true)}>
        <Icon icon={faRepeat} />
      </Button>
    </InputGroup>
  )
}

const BankGoldAction = ({
  action,
  label,
  initial = 0,
}: { action: (quantity: number) => void; label: string; initial?: number }) => {
  const [amount, setAmount] = useState(initial)

  return (
    <div>
      <InputGroup>
        <Form.Control type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <Button onClick={() => action(amount)}>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth />
          {label}
        </Button>
      </InputGroup>
    </div>
  )
}

const ResourceDetail = ({ code }: { code: string }) => {
  const resource = useResource(code)

  if (!resource) return null

  return (
    <div>
      <div className="d-flex justify-content-start align-items-end gap-2 mb-2">
        <div style={{ minWidth: 50 }} className="d-flex align-items-center justify-content-center">
          <img src={`https://artifactsmmo.com/images/resources/${code}.png`} alt="" height={50} />
        </div>
        <h5>
          {resource.name}{' '}
          <small className="text-muted">
            {resource.skill}@lvl{resource.level}
          </small>
        </h5>
      </div>
      <ListGroup>
        {resource.drops.map((item) => (
          <ListGroup.Item key={item.code}>
            <Item code={item.code} imgProps={{ height: 20 }} />
            <small className="text-muted">
              {' '}
              x{item.min_quantity === item.max_quantity && item.min_quantity}
              {item.min_quantity !== item.max_quantity && `${item.min_quantity}-${item.max_quantity}`} @{' '}
              {((1 / item.rate) * 100).toFixed(2)}%
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

const MonsterDetail = ({ code }: { code: string }) => {
  const monster = useMonster(code)

  if (!monster) return null

  return (
    <div>
      <div className="d-flex justify-content-start align-items-end gap-2 mb-2">
        <div style={{ minWidth: 50 }} className="d-flex align-items-center justify-content-center">
          <img src={`https://artifactsmmo.com/images/monsters/${code}.png`} alt="" height={50} />
        </div>
        <h5>
          {monster.name} <small className="text-muted">lvl{monster.level}</small>
        </h5>
      </div>
      <p>{monster.hp.toLocaleString()} hp</p>
      {!!monster.effects?.length && <h6>Effects</h6>}
      <ListGroup>
        {monster.effects?.map((effect) => (
          <ListGroup.Item key={effect.code}>
            <CharacterEffect code={effect.code} imgProps={{ height: 20 }} />{' '}
            <small className="text-muted">{effect.value}%</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h6>Drops</h6>
      <ListGroup>
        {monster.drops.map((item) => (
          <ListGroup.Item key={item.code}>
            <Item code={item.code} imgProps={{ height: 20 }} />
            <small className="text-muted">
              {' '}
              x{item.min_quantity === item.max_quantity && item.min_quantity}
              {item.min_quantity !== item.max_quantity && `${item.min_quantity}-${item.max_quantity}`} @{' '}
              {((1 / item.rate) * 100).toFixed(2)}%
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

const ActionCard = () => {
  const {
    character,
    actions: { move, depositAll, craft, buyExpansion, depositGold, withdrawGold },
  } = useContext(CharacterContext)
  const { bankDetails } = useContext(BankItemsContext)
  const currentPosition = character ? { x: character.x, y: character.y } : { x: 0, y: 0 }

  const [targetMap, setTargetMap] = useState<components['schemas']['MapSchema'] | null>(null)

  const [contentType, setContentType] = useState<components['schemas']['MapContentType'] | undefined>(undefined)
  const maps = useMaps({ currentPosition, contentType })

  const mapLookup: Record<string, components['schemas']['MapSchema']> = Object.fromEntries(
    maps.data ? maps.data.map((item) => [`${item.x},${item.y}`, item]) : []
  )

  const { items, pagination } = useItems({
    skill: targetMap?.content?.code as components['schemas']['CraftSkill'],
    skip: targetMap?.content?.type !== 'workshop',
  })

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [x, y] = e.currentTarget.value.split(',').map(Number)
    setTargetMap(mapLookup[`${x},${y}`])
  }

  useEffect(() => {
    if (maps.data && maps.data.length > 0) setTargetMap(maps.data[0])
  }, [maps?.data])

  const distance =
    targetMap && currentPosition ? euclideanDistance({ x: targetMap.x, y: targetMap.y }, currentPosition) : 0

  return (
    <Card>
      <Form>
        <Card.Body>
          <Card.Title>Actions</Card.Title>
          <InputGroup>
            <Form.Select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as components['schemas']['MapContentType'])}
            >
              <option>---</option>
              {RESOURCE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
            {maps.data && (
              <Form.Select onChange={handleSelect} style={{ width: '30%' }}>
                {maps.data.map((item) => {
                  const key = `${item.x},${item.y}`
                  return (
                    <option key={key} value={key}>
                      {item.name}
                      {item.content && `[${item.content.code}]`} @ {item.x},{item.y}
                    </option>
                  )
                })}
              </Form.Select>
            )}
            <Button type="button" onClick={() => move({ x: targetMap?.x || 0, y: targetMap?.y || 0 })}>
              <Icon icon={faPersonHiking} /> Move {distance > 0 && `(${distance * 5}s)`}
            </Button>

            <Button type="button" onClick={() => move({ x: targetMap?.x || 0, y: targetMap?.y || 0 }, undefined, true)}>
              <Icon icon={faRepeat} />
            </Button>
          </InputGroup>
          <Accordion className="mt-2">
            {items && (
              <Accordion.Item eventKey="0">
                <Accordion.Header as="h4">Crafting ({items.total})</Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {items.data.map((item) => (
                      <ListGroup.Item key={item.code} className="d-flex justify-content-between align-items-center">
                        <Item code={item.code} imgProps={{ height: 20 }} />
                        <CraftControl code={item.code} craft={craft} />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Pagination className="mt-2 ms-auto" {...pagination} />
                </Accordion.Body>
              </Accordion.Item>
            )}

            {targetMap?.content?.type === 'bank' && (
              <Accordion.Item eventKey="1">
                <Accordion.Header as="h4">Bank Actions</Accordion.Header>
                <Accordion.Body>
                  <Stack gap={2}>
                    <Stack gap={2} direction="horizontal">
                      <Dropdown as={ButtonGroup}>
                        <Button onClick={() => depositAll({ x: targetMap?.x || 0, y: targetMap?.y || 0 })}>
                          Deposit all items
                        </Button>
                        <Dropdown.Toggle split />

                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => depositAll({ x: targetMap?.x || 0, y: targetMap?.y || 0 }, false, true)}
                          >
                            and return
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => depositAll({ x: targetMap?.x || 0, y: targetMap?.y || 0 }, true, false)}
                          >
                            repeatedly
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => depositAll({ x: targetMap?.x || 0, y: targetMap?.y || 0 }, true, true)}
                          >
                            repeatedly and return
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                      <Button onClick={() => buyExpansion()}>
                        Buy Expansion (<Icon icon={faCoins} color="#ffd82f" fixedWidth />
                        {bankDetails?.data.next_expansion_cost.toLocaleString()})
                      </Button>
                    </Stack>
                    <Stack gap={2} direction="horizontal">
                      <BankGoldAction action={depositGold} label="Deposit" initial={character?.gold} />
                      <BankGoldAction action={withdrawGold} label="Withdraw" initial={bankDetails?.data.gold} />
                    </Stack>
                  </Stack>
                </Accordion.Body>
              </Accordion.Item>
            )}

            {targetMap?.content?.type === 'resource' && (
              <Accordion.Item eventKey="2">
                <Accordion.Header as="h4">Resource Details</Accordion.Header>
                <Accordion.Body>
                  <ResourceDetail code={targetMap?.content?.code} />
                </Accordion.Body>
              </Accordion.Item>
            )}

            {targetMap?.content?.type === 'monster' && (
              <Accordion.Item eventKey="3">
                <Accordion.Header as="h4">Monster Details</Accordion.Header>
                <Accordion.Body>
                  <MonsterDetail code={targetMap?.content?.code} />
                </Accordion.Body>
              </Accordion.Item>
            )}
          </Accordion>
        </Card.Body>
      </Form>
    </Card>
  )
}

export { ActionCard }
