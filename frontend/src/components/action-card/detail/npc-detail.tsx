import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Badge, Button, Form, InputGroup, ListGroup } from 'react-bootstrap'
import { useNpcItems } from '../../../artifactsmmo-client/hooks/use-npc-items.ts'
import type { components } from '../../../artifactsmmo-client/spec'
import { useCharacterContext } from '../../../utils/contexts/character/context.ts'
import { Item } from '../../item/item.tsx'
import { Pagination } from '../../pagination/pagination.tsx'

const BuyItemControl = ({ item }: { item: components['schemas']['NPCItem'] }) => {
  const [quantity, setQuantity] = useState(1)
  const {
    actions: { buyItem, sellItem },
  } = useCharacterContext()

  return (
    <InputGroup size="sm">
      <Form.Control type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      {item.buy_price && (
        <Button variant="outline-success" onClick={() => buyItem({ code: item.code, quantity })}>
          <Badge bg="success">Buy</Badge>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth className="mx-1" />x{item.buy_price.toLocaleString()}
        </Button>
      )}
      {item.sell_price && (
        <Button variant="outline-warning" onClick={() => sellItem({ code: item.code, quantity })}>
          <Badge bg="warning">Sell</Badge>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth className="mx-1" />x{item.sell_price.toLocaleString()}
        </Button>
      )}
    </InputGroup>
  )
}

const NpcDetail = ({ npc }: { npc: string }) => {
  const { items, pagination } = useNpcItems({ npc })

  return (
    <>
      <ListGroup variant="flush">
        {items?.data.map((item) => (
          <ListGroup.Item key={item.code} className="d-flex justify-content-between align-items-center">
            <div className="w-100">
              <Item code={item.code} imgProps={{ height: 20 }} />
            </div>
            <BuyItemControl item={item} />
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="mt-2 d-flex justify-content-around align-items-center">
        <Pagination {...pagination} />
      </div>
    </>
  )
}

export { NpcDetail }
