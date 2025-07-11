import { faPersonHiking, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import { Accordion, Button, Card, Form, InputGroup, Nav } from 'react-bootstrap'
import { useMaps } from '../../artifactsmmo-client/hooks/use-maps.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { MAP_CONTENT_TYPES } from '../../constants.ts'
import { euclideanDistance } from '../../utils/euclidean-distance.ts'
import { BankDetail } from './detail/bank-detail.tsx'
import { CraftDetail } from './detail/craft-detail.tsx'
import { MonsterDetail } from './detail/monster-detail.tsx'
import { NpcDetail } from './detail/npc-detail.tsx'
import { ResourceDetail } from './detail/resource-detail.tsx'
import { TasksMasterDetail } from './detail/tasks-master-detail.tsx'
import {useCharacterActions} from "../../hooks/use-character-actions.ts";

const ActionCard = () => {
  const {
    character,
    actions: { move },
  } = useCharacterActions()
  const currentPosition = character ? { x: character.x, y: character.y } : { x: 0, y: 0 }

  const [targetMap, setTargetMap] = useState<components['schemas']['MapSchema'] | null>(null)

  const [contentType, setContentType] = useState<components['schemas']['MapContentType']>('monster')
  const {
    query: { data: maps },
  } = useMaps({ currentPosition, filters: { content_type: contentType } })

  const mapLookup: Record<string, components['schemas']['MapSchema']> = Object.fromEntries(
    maps ? maps.data.map((item) => [`${item.x},${item.y}`, item]) : []
  )

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [x, y] = e.currentTarget.value.split(',').map(Number)
    setTargetMap(mapLookup[`${x},${y}`])
  }

  useEffect(() => {
    if (maps && maps.data.length > 0) setTargetMap(maps.data[0])
  }, [maps])

  const distance =
    targetMap && currentPosition ? euclideanDistance({ x: targetMap.x, y: targetMap.y }, currentPosition) : 0

  return (
    <Card>
      <Form>
        <Card.Body>
          <Card.Title>Actions</Card.Title>
          <Nav variant="pills" className="border-0 mb-2">
            {Object.entries(MAP_CONTENT_TYPES).map(([type, label]) => (
              <Nav.Item key={type}>
                <Nav.Link
                  active={contentType === type}
                  onClick={() => setContentType(type as components['schemas']['MapContentType'])}
                >
                  {label}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <InputGroup>
            {maps?.data && (
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
            <Button type="button" onClick={() => move({ pos: { x: targetMap?.x || 0, y: targetMap?.y || 0 } })}>
              <Icon icon={faPersonHiking} /> Move {distance > 0 && `(${distance * 5}s)`}
            </Button>

            <Button
              type="button"
              onClick={() => move({ pos: { x: targetMap?.x || 0, y: targetMap?.y || 0 }, requeue: true })}
            >
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

            {targetMap?.content?.type === 'npc' && (
              <Accordion.Item eventKey="5">
                <Accordion.Header as="h4">NPC Vendor</Accordion.Header>
                <Accordion.Body>
                  <NpcDetail npc={targetMap.content.code} />
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
