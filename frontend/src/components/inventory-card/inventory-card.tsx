import { Guid } from 'guid-typescript'
import { useState } from 'react'
import { Button, Card, Form, InputGroup, ListGroup, Nav } from 'react-bootstrap'
import { useBankItems } from '../../artifactsmmo-client/hooks/use-bank-items.ts'
import type { components } from '../../artifactsmmo-client/spec'
import type { Queue } from '../../types.ts'

interface DepositButtonGroupProps {
  action(code: string, quantity: number): void
  code: string
  quantity: number
}

const ItemActionGroup = ({ action, code, quantity }: DepositButtonGroupProps) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity)

  return (
    <InputGroup>
      <InputGroup.Text className="w-50">
        {code} x {quantity}
      </InputGroup.Text>
      <Form.Control
        type="number"
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
      />
      <Button onClick={() => action(code, selectedQuantity)}>Some</Button>
      <Button variant="danger" onClick={() => action(code, quantity)}>
        All
      </Button>
    </InputGroup>
  )
}

interface Props {
  character: components['schemas']['CharacterSchema']
  depositItem(code: string, quantity: number): void
  withdrawItem(code: string, quantity: number): void
  queueAction(f: Queue): void
}

const InventoryCard = ({ character, depositItem, withdrawItem, queueAction }: Props) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'bank'>('bank')
  const { bankItems, setPage, refetch } = useBankItems()
  const usedSlots = character.inventory?.filter((item) => item.code !== '') || []

  const handleDepositItem = (code: string, quantity: number): void => {
    queueAction({
      guid: Guid.create(),
      label: `Deposit ${quantity} x ${code}`,
      action: () => depositItem(code, quantity),
    })
  }

  const handleWithdrawItem = (code: string, quantity: number): void => {
    queueAction({
      guid: Guid.create(),
      label: `Withdraw ${quantity} x ${code}`,
      action: () => withdrawItem(code, quantity),
    })
  }

  return (
    <>
      <Card>
        <Card.Body>
          <Nav variant="underline" className="mb-2">
            <Nav.Item>
              <Nav.Link active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>
                Inventory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'bank'}
                onClick={() => {
                  refetch().then(() => setActiveTab('bank'))
                }}
              >
                Bank
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {activeTab === 'inventory' && (
            <>
              {usedSlots.length === 0 && 'Empty!'}
              {usedSlots.length > 0 && (
                <ListGroup variant="flush">
                  {usedSlots.map((item) => (
                    <ListGroup.Item key={item.slot}>
                      <div className="d-flex align-items-center gap-2">
                        <ItemActionGroup code={item.code} quantity={item.quantity} action={handleDepositItem} />
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          )}
          {activeTab === 'bank' && bankItems && (
            <ListGroup variant="flush">
              {bankItems.data.map((item) => (
                <ListGroup.Item key={item.code}>
                  <div className="d-flex align-items-center gap-2">
                    <ItemActionGroup code={item.code} quantity={item.quantity} action={handleWithdrawItem} />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
        {activeTab === 'inventory' && (
          <Card.Footer>
            {usedSlots.length || 0} / {character.inventory?.length || 0}
          </Card.Footer>
        )}
        {activeTab === 'bank' && (
          <Card.Footer className="d-flex justify-content-end align-items-center gap-2">
            <span className="w-100 text-end">Page:</span>
            <Form.Control
              type="number"
              value={bankItems?.page || 1}
              max={bankItems?.pages || 1}
              min={1}
              onChange={(e) => setPage(Number(e.target.value))}
            />
          </Card.Footer>
        )}
      </Card>
    </>
  )
}

export { InventoryCard }
