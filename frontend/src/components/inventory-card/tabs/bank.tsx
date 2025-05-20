import { faBorderAll, faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Card, Form, Table } from 'react-bootstrap'
import { useBankDetails } from '../../../artifactsmmo-client/hooks/use-bank-details.ts'
import { useBankItems } from '../../../artifactsmmo-client/hooks/use-bank-items.ts'
import { useCharacterContext } from '../../../utils/contexts/character/context.ts'
import { Item } from '../../item/item.tsx'
import { Pagination } from '../../pagination/pagination.tsx'
import { ItemActionGroup } from '../item-action-group.tsx'

const Bank = () => {
  const {
    character,
    actions: { withdraw },
  } = useCharacterContext()
  const { data: bankDetails } = useBankDetails()
  const {
    query: { data: bankItems },
    pagination,
    filter,
    setFilter,
  } = useBankItems()

  if (!bankItems || !character) return

  return (
    <Card>
      <Card.Header>
        <Form.Control
          type="text"
          value={filter || ''}
          placeholder="Filter"
          onChange={(e) => setFilter(e.target.value)}
        />
      </Card.Header>
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
      <Card.Footer>
        <div className="d-flex align-items-center justify-content-between">
          <span>
            <Icon icon={faCoins} color="#ffd82f" fixedWidth /> {bankDetails?.gold.toLocaleString()}
          </span>
          <div className="d-flex justify-content-center align-items-center">
            <Pagination {...pagination} />
          </div>
          <span>
            <Icon icon={faBorderAll} fixedWidth />
            {bankItems.total || 0} / {bankDetails?.slots || 0}
          </span>
        </div>
      </Card.Footer>
    </Card>
  )
}

export { Bank }
