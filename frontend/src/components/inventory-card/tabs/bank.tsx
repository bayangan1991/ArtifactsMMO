import { faBorderAll, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useContext } from 'react'
import { Card, Table } from 'react-bootstrap'
import { BankItemsContext } from '../../../utils/contexts/bank-items/context.ts'
import { CharacterContext } from '../../../utils/contexts/character/context.ts'
import { Item } from '../../item/item.tsx'
import { Pagination } from '../../pagination/pagination.tsx'
import { ItemActionGroup } from '../item-action-group.tsx'

const Bank = () => {
  const {
    character,
    actions: { withdraw },
  } = useContext(CharacterContext)
  const { bankItems, pagination, bankDetails } = useContext(BankItemsContext)

  if (!bankItems || !character) return

  return (
    <Card>
      <Card.Body>
        <Table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Withdraw</th>
            </tr>
          </thead>
          <tbody>
            {bankItems.data.map((item) => (
              <tr key={item.code}>
                <td>
                  <Item code={item.code} />
                </td>
                <td>{item.quantity}</td>
                <td>
                  <ItemActionGroup
                    code={item.code}
                    quantity={item.quantity}
                    action={withdraw}
                    max={Math.min(item.quantity, character.inventory_max_items)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="d-flex align-items-center gap-2 justify-content-between">
        <span>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth /> {bankDetails?.data.gold.toLocaleString()}
        </span>
        <span>
          <Icon icon={faBorderAll} fixedWidth />
          {bankItems.total || 0} / {bankDetails?.data.slots || 0}
        </span>
        <div className="d-flex align-items-center gap-2">
          <span className="ms-auto">Page:</span>
          <Pagination {...pagination} />
        </div>
      </Card.Footer>
    </Card>
  )
}

export { Bank }
