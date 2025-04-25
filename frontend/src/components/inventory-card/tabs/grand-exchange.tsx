import { useContext } from 'react'
import { Card, Form, Table } from 'react-bootstrap'
import { GrandExchangeContext } from '../../../utils/contexts/grand-exchange/context.ts'
import { Item } from '../../item/item.tsx'
import { Pagination } from '../../pagination/pagination.tsx'

const GrandExchange = () => {
  const { grandExchange, pagination, filter, setFilter } = useContext(GrandExchangeContext)

  if (!grandExchange) return

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
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {grandExchange.data.map((item) => (
              <tr key={item.code}>
                <td>
                  <Item code={item.code} />
                </td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer>
        <div className="d-flex align-items-center justify-content-between">
          <span />
          <div className="d-flex justify-content-center align-items-center">
            <Pagination {...pagination} />
          </div>
          <span />
        </div>
      </Card.Footer>
    </Card>
  )
}

export { GrandExchange }
