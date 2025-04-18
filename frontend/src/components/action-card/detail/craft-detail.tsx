import { faBrain, faHammer, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap'
import { useItem } from '../../../artifactsmmo-client/hooks/use-item.ts'
import { useItems } from '../../../artifactsmmo-client/hooks/use-items.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import type { Position } from '../../../types.ts'
import { CharacterContext } from '../../../utils/contexts/character/context.ts'
import { Item } from '../../item/item.tsx'
import { Pagination } from '../../pagination/pagination.tsx'

const CraftControl = ({ code, workshop }: { code: string; workshop: Position }) => {
  const [quantity, setQuantity] = useState(1)
  const {
    actions: { craft, smartCraft },
  } = useContext(CharacterContext)
  const item = useItem(code)

  return (
    <InputGroup size="sm" style={{ width: 200 }}>
      <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <Button onClick={() => craft(code, quantity)}>
        <Icon icon={faHammer} />
      </Button>
      {item && (
        <>
          <Button onClick={() => smartCraft(item, workshop)}>
            <Icon icon={faBrain} />
          </Button>
          <Button onClick={() => smartCraft(item, workshop, true)}>
            <Icon icon={faRepeat} />
          </Button>
        </>
      )}
    </InputGroup>
  )
}

const CraftDetail = ({ skill, pos }: { skill: components['schemas']['CraftSkill']; pos: Position }) => {
  const { items, pagination } = useItems({ skill })

  return (
    <>
      <ListGroup variant="flush">
        {items?.data.map((item) => (
          <ListGroup.Item key={item.code} className="d-flex justify-content-between align-items-center">
            <Item code={item.code} imgProps={{ height: 20 }} />
            <CraftControl code={item.code} workshop={{ x: pos.x, y: pos.y }} />
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="mt-2 d-flex justify-content-around align-items-center">
        <Pagination {...pagination} />
      </div>
    </>
  )
}

export { CraftDetail }
