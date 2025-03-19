import { faPersonHiking } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useEffect, useState } from 'react'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import { useMaps } from '../../artifactsmmo-client/hooks/use-maps.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { RESOURCE_TYPES } from '../../constants.ts'
import type { Position } from '../../types.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'

interface Props {
  currentPosition?: Position
  doMove: (pos: Position) => void
}

const ActionMoveCard = ({ doMove, currentPosition }: Props) => {
  const [targetMap, setTargetMap] = useState<components['schemas']['MapSchema'] | null>(null)

  const [contentType, setContentType] = useState<components['schemas']['MapContentType'] | undefined>(undefined)
  const maps = useMaps({ currentPosition, contentType })

  const mapLookup: Record<string, components['schemas']['MapSchema']> = Object.fromEntries(
    maps.data ? maps.data.map((item) => [`${item.x},${item.y}`, item]) : []
  )

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
        </Card.Body>
        <Card.Footer>
          <Button
            disabled={distance === 0}
            type="button"
            onClick={() => doMove({ x: targetMap?.x || 0, y: targetMap?.y || 0 })}
          >
            <Icon icon={faPersonHiking} /> Move to {targetMap?.name} {distance > 0 && `(${distance * 5}s)`}
          </Button>
        </Card.Footer>
      </Form>
    </Card>
  )
}

export { ActionMoveCard }
