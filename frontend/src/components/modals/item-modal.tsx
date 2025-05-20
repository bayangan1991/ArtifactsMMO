import React, { useContext, useState } from 'react'
import { Badge, Button, Col, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import { useItems } from '../../artifactsmmo-client/hooks/use-items.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { ItemModalContext } from '../../utils/contexts/modal/context.ts'
import { CharacterEffect } from '../character-effect/character-effect.tsx'
import { Item } from '../item/item.tsx'
import { Pagination } from '../pagination/pagination.tsx'

interface Props {
  show?: boolean
  item: components['schemas']['ItemSchema']
  handleClose(): void
}

const FormFieldRow = ({ label, value }: { label: React.ReactNode; value: string | number }) => (
  <Form.Group as={Row} className="align-items-baseline">
    <Form.Label column sm={5}>
      {label}
    </Form.Label>
    <Col>
      <Form.Control size="sm" readOnly value={value} />
    </Col>
  </Form.Group>
)

const ItemModal = ({ show, item, handleClose }: Props) => {
  const { goBack } = useContext(ItemModalContext)
  const [page, setPage] = useState(1)
  const { data } = useItems({ filters: { craft_material: item.code, size: 10, page } })

  if (!data) return

  const { data: craftableItems, size, ...pagination } = data

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header>
        <img
          height="25"
          className="me-1"
          src={`https://artifactsmmo.com/images/items/${item.code}.png`}
          alt={item.code}
        />
        <span className="me-auto">{item.name}</span>
        {item.tradeable && (
          <Badge className="text-uppercase ms-auto" bg="success">
            Tradeable
          </Badge>
        )}
      </Modal.Header>
      <Modal.Body>
        {item.description && <p>{item.description}</p>}
        <Form>
          <h5 className="mt-3">Information</h5>
          <FormFieldRow label="Level" value={item.level} />
          <FormFieldRow label="Type" value={item.type} />
          {item.subtype && <FormFieldRow label="Subtype" value={item.subtype} />}
          {item.effects && item.effects.length > 0 && (
            <>
              <hr />
              <h5 className="mt-3">Effects</h5>
              {item.effects?.map((effect) => (
                <FormFieldRow
                  key={effect.code}
                  label={<CharacterEffect code={effect.code} imgProps={{ height: 20 }} />}
                  value={effect.value}
                />
              ))}
            </>
          )}
          {item.craft && (
            <>
              <hr />
              <h5 className="mt-3">Crafting</h5>
              {item.craft.quantity && <FormFieldRow label="Quantity" value={item.craft.quantity} />}
              {item.craft.skill && <FormFieldRow label="Skill" value={item.craft.skill} />}
              {item.craft.level && <FormFieldRow label="Level" value={item.craft.level} />}
              <h6 className="mt-3">Requirements</h6>
              {item.craft.items && item.craft.items.length > 0 && (
                <ListGroup>
                  {item.craft.items.map((craftItem) => (
                    <ListGroup.Item key={craftItem.code}>
                      <Item code={craftItem.code} useHistory />
                      <small className="text-muted"> x {craftItem.quantity}</small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
          {!!pagination?.total && (
            <>
              <hr />
              <h5 className="mt-3">Used in</h5>
              <ListGroup className="mb-2">
                {craftableItems.map((craftItem) => (
                  <ListGroup.Item key={craftItem.code} className="d-flex justify-content-between">
                    <Item code={craftItem.code} useHistory />{' '}
                    <small className="text-muted">
                      {craftItem.craft?.skill} @ lvl{craftItem.craft?.level}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="d-flex justify-content-center">
                <Pagination {...pagination} setPage={setPage} size="sm" />
              </div>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {goBack && (
          <Button variant="outline-light" className="ms-2" onClick={goBack}>
            Back
          </Button>
        )}
        <Button onClick={handleClose} variant="outline-primary">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { ItemModal }
