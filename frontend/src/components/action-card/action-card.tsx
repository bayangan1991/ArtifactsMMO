import { faHammer, faPersonHiking, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useEffect, useState } from 'react'
import { Accordion, Button, ButtonGroup, Card, Dropdown, Form, InputGroup, ListGroup, Stack } from 'react-bootstrap'
import { useItems } from '../../artifactsmmo-client/hooks/use-items.ts'
import { useMaps } from '../../artifactsmmo-client/hooks/use-maps.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { RESOURCE_TYPES } from '../../constants.ts'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { Item } from '../item/item.tsx'
import { Pagination } from '../pagination/pagination.tsx'

interface Props {
  currentPosition?: Position
  move: (pos: Position, index?: number, requeue?: boolean) => void
  craft: (code: string, quantity: number, requeue?: boolean) => void
  depositAll(pos: Position, requeue?: boolean, returnToPos?: boolean): void
}

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

const ActionCard = ({ move, craft, currentPosition, depositAll }: Props) => {
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
                  <Stack gap={2} direction="horizontal">
                    <Dropdown as={ButtonGroup}>
                      <Button onClick={() => depositAll({ x: targetMap?.x || 0, y: targetMap?.y || 0 })}>
                        Deposit All
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
                  </Stack>
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
