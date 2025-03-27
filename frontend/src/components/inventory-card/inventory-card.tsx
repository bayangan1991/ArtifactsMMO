import { faBank, faBoxArchive, faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Button, Card, Form, InputGroup, Nav, Table } from 'react-bootstrap'
import { useBankItems } from '../../artifactsmmo-client/hooks/use-bank-items.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { Item } from '../item-img/item.tsx'
import { Pagination } from '../pagination/pagination.tsx'

interface ItemActionGroupProps {
  action(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
  code: string
  quantity: number
  max: number
}

const ItemActionGroup = ({ action, code, quantity, max }: ItemActionGroupProps) => {
  const [selectedQuantity, setSelectedQuantity] = useState(Math.min(quantity, max))

  useEffect(() => {
    setSelectedQuantity(Math.min(quantity, max))
  }, [quantity, max])

  return (
    <InputGroup size="sm">
      <Form.Control
        type="number"
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
        max={max}
        min={1}
      />
      <Button onClick={() => action(code, selectedQuantity)}>Some</Button>
      <Button variant="danger" onClick={() => action(code, quantity)}>
        All
      </Button>
      <Button onClick={() => action(code, selectedQuantity, undefined, true)}>
        <Icon icon={faRepeat} />
      </Button>
    </InputGroup>
  )
}

interface Props {
  character: components['schemas']['CharacterSchema']
  depositItem(code: string, quantity: number): void
  withdrawItem(code: string, quantity: number, index?: number, requeue?: boolean): void
}

const InventoryCard = ({ character, depositItem, withdrawItem }: Props) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'bank'>('inventory')
  const { bankItems, setPage, refetch } = useBankItems()
  const usedSlots = character.inventory?.filter((item) => item.code !== '') || []

  const inventorySize = 100 + 2 * (character.level - 1)
  const usedInventorySize = usedSlots.map((t) => t.quantity).reduce((v, acc) => v + acc, 0)

  return (
    <>
      <Card>
        <Card.Body>
          <Nav variant="underline" className="mb-2">
            <Nav.Item>
              <Nav.Link active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>
                <Icon icon={faBoxArchive} /> Inventory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'bank'}
                onClick={() => {
                  refetch().then(() => setActiveTab('bank'))
                }}
              >
                <Icon icon={faBank} /> Bank
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {activeTab === 'inventory' && (
            <Table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Deposit</th>
                </tr>
              </thead>

              <tbody>
                {usedSlots.length === 0 && (
                  <tr>
                    <td colSpan={100} className="text-muted text-center">
                      Nothing in your inventory
                    </td>
                  </tr>
                )}
                {usedSlots.map((item) => (
                  <tr key={item.slot}>
                    <td>
                      <Item code={item.code} />
                    </td>
                    <td>{item.quantity}</td>
                    <td>
                      <ItemActionGroup
                        code={item.code}
                        quantity={item.quantity}
                        action={depositItem}
                        max={item.quantity}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {activeTab === 'bank' && bankItems && (
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
                        action={withdrawItem}
                        max={Math.min(item.quantity, inventorySize)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
        {activeTab === 'inventory' && (
          <Card.Footer className="d-flex justify-content-between">
            <span>
              {usedSlots.length || 0} / {character.inventory?.length || 0}
            </span>
            <span>
              {usedInventorySize} / {inventorySize}
            </span>
          </Card.Footer>
        )}
        {activeTab === 'bank' && (
          <Card.Footer className="d-flex align-items-center gap-2">
            <span className="ms-auto">Page:</span>
            <Pagination page={bankItems?.page} pages={bankItems?.pages} setPage={setPage} />
          </Card.Footer>
        )}
      </Card>
    </>
  )
}

export { InventoryCard }
