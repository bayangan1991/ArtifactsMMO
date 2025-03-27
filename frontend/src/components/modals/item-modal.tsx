import { Col, Form, ListGroup, Modal, Row } from 'react-bootstrap'
import type { components } from '../../artifactsmmo-client/spec'
import { Item } from '../item-img/item.tsx'

interface Props {
  show?: boolean
  item: components['schemas']['ItemSchema']
  handleClose(): void
}

const FormFieldRow = ({ label, value }: { label: string; value: string | number }) => (
  <Form.Group as={Row}>
    <Form.Label column sm={5}>
      {label}
    </Form.Label>
    <Col>
      <Form.Control size="sm" readOnly value={value} />
    </Col>
  </Form.Group>
)

const ItemModal = ({ show, item, handleClose }: Props) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <img
          height="25"
          className="me-1"
          src={`https://artifactsmmo.com/images/items/${item.code}.png`}
          alt={item.code}
        />
        {item.name}
      </Modal.Header>
      <Modal.Body>
        {item.description && <p>{item.description}</p>}
        <Form>
          <h5 className="mt-3">Information</h5>
          <FormFieldRow label="Type" value={item.type} />
          {item.subtype && <FormFieldRow label="Subtype" value={item.subtype} />}
          {item.effects && item.effects.length > 0 && (
            <>
              <h5 className="mt-3">Effects</h5>
              {item.effects?.map((effect) => (
                <FormFieldRow key={effect.code} label={effect.code} value={effect.value} />
              ))}
            </>
          )}
          {item.craft && (
            <>
              <h5 className="mt-3">Crafting (x{item.craft.quantity})</h5>
              {item.craft.skill && <FormFieldRow label="Skill" value={item.craft.skill} />}
              {item.craft.level && <FormFieldRow label="Level" value={item.craft.level} />}
              <h6 className="mt-3">Requirements</h6>
              {item.craft.items && item.craft.items.length > 0 && (
                <ListGroup>
                  {item.craft.items.map((craftItem) => (
                    <ListGroup.Item key={craftItem.code}>
                      <Item code={craftItem.code} /> x {craftItem.quantity}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export { ItemModal }
