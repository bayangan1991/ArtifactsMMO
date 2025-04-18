import { faPersonHiking, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import { Accordion, Button, Card, Form, InputGroup } from 'react-bootstrap'
import { useMaps } from '../../artifactsmmo-client/hooks/use-maps.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { RESOURCE_TYPES } from '../../constants.ts'
import { CharacterContext } from '../../utils/contexts/character/context.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { BankDetail } from './detail/bank-detail.tsx'
import { CraftDetail } from './detail/craft-detail.tsx'
import { MonsterDetail } from './detail/monster-detail.tsx'
import { ResourceDetail } from './detail/resource-detail.tsx'
import { TasksMasterDetail } from './detail/tasks-master-detail.tsx'

const ActionCard = () => {
  const {
    character,
    actions: { move },
  } = useContext(CharacterContext)
  const currentPosition = character ? { x: character.x, y: character.y } : { x: 0, y: 0 }

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
            {targetMap?.content?.type === 'workshop' && (
              <Accordion.Item eventKey="0">
                <Accordion.Header as="h4">Crafting</Accordion.Header>
                <Accordion.Body>
                  <CraftDetail
                    skill={targetMap.content.code as components['schemas']['CraftSkill']}
                    pos={{ x: targetMap.x, y: targetMap.y }}
                  />
                </Accordion.Body>
              </Accordion.Item>
            )}

            {targetMap?.content?.type === 'bank' && (
              <Accordion.Item eventKey="1">
                <Accordion.Header as="h4">Bank Actions</Accordion.Header>
                <Accordion.Body>
                  <BankDetail pos={{ x: targetMap.x, y: targetMap.y }} />
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

            {targetMap?.content?.type === 'tasks_master' && (
              <Accordion.Item eventKey="4">
                <Accordion.Header as="h4">Tasks Master</Accordion.Header>
                <Accordion.Body>
                  <TasksMasterDetail />
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
