import { faPersonHiking } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useEffect, useState } from 'react'
import { Accordion, Button, Card, Form, InputGroup, ListGroup } from 'react-bootstrap'
import { useItems } from '../../artifactsmmo-client/hooks/use-items.ts'
import { useMaps } from '../../artifactsmmo-client/hooks/use-maps.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { RESOURCE_TYPES } from '../../constants.ts'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { ItemImg } from '../item-img/item-img.tsx'
import { Pagination } from '../pagination/pagination.tsx'

interface Props {
  currentPosition?: Position
  doMove: (pos: Position) => void
}

const ActionCard = ({ doMove, currentPosition }: Props) => {
  const [targetMap, setTargetMap] = useState<components['schemas']['MapSchema'] | null>(null)

  const [contentType, setContentType] = useState<components['schemas']['MapContentType'] | undefined>(undefined)
  const maps = useMaps({ currentPosition, contentType })

  const mapLookup: Record<string, components['schemas']['MapSchema']> = Object.fromEntries(
    maps.data ? maps.data.map((item) => [`${item.x},${item.y}`, item]) : []
  )

  const { items, setPage } = useItems({
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
          <Card.Title>Move</Card.Title>
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
              <Form.Select onChange={handleSelect} style={{ width: '50%' }}>
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
          </InputGroup>
          {items && (
            <Accordion className="mt-2">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  Crafting <span className="ms-start">({items.total})</span>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup variant="flush">
                    {items.data.map((item) => (
                      <ListGroup.Item key={item.code}>
                        <ItemImg code={item.code} height={20} className="me-2" />
                        {item.name}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Pagination className="mt-2 ms-auto" setPage={setPage} page={items.page} pages={items.pages} />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </Card.Body>
        <Card.Footer>
          <Button type="button" onClick={() => doMove({ x: targetMap?.x || 0, y: targetMap?.y || 0 })}>
            <Icon icon={faPersonHiking} /> Move to {targetMap?.name} {distance > 0 && `(${distance * 5}s)`}
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}

export { ActionCard }
