import { faBrain, faHammer, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap'
import { useItem } from '../../../artifactsmmo-client/hooks/use-item.ts'
import { useItems } from '../../../artifactsmmo-client/hooks/use-items.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import type { Position } from '../../../types.ts'
import { useCharacterContext } from '../../../utils/contexts/character/context.ts'
import { Item } from '../../item/item.tsx'
import { Pagination } from '../../pagination/pagination.tsx'

const CraftControl = ({ code, workshop }: { code: string; workshop: Position }) => {
  const [quantity, setQuantity] = useState(1)
  const {
    actions: { smartCraft },
  } = useCharacterContext()
  const { data: item } = useItem({ code })

  return (
    <InputGroup size="sm">
      <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      {item && (
        <>
          <Button onClick={() => smartCraft({ item, workshop, quantity })}>
            <Icon icon={faHammer} />
          </Button>

          <Button onClick={() => smartCraft({ item, workshop })}>
            <Icon icon={faBrain} />
          </Button>
          <Button onClick={() => smartCraft({ item, workshop, requeue: true })}>
            <Icon icon={faRepeat} />
          </Button>
        </>
      )}
    </InputGroup>
  )
}

const CraftDetail = ({ skill, pos }: { skill: components['schemas']['CraftSkill']; pos: Position }) => {
  const [page, setPage] = useState(1)
  const { data: items } = useItems({ filters: { craft_skill: skill, page, size: 15 } })

  if (!items) return

  const { data, size, ...pagination } = items

  return (
    <>
      <ListGroup variant="flush">
        {data.map((item) => (
          <ListGroup.Item key={item.code} className="d-flex justify-content-between align-items-center">
            <div className="w-100">
              <Item code={item.code} imgProps={{ height: 20 }} />
            </div>
            <CraftControl code={item.code} workshop={{ x: pos.x, y: pos.y }} />
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="mt-2 d-flex justify-content-around align-items-center">
        <Pagination {...pagination} setPage={setPage} />
      </div>
    </>
  )
}

export { CraftDetail }
