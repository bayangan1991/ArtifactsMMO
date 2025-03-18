import { faBank, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Button, Card, Form, InputGroup, ListGroup, Nav } from 'react-bootstrap'
import { useBankItems } from '../../artifactsmmo-client/hooks/use-bank-items.ts'
import type { components } from '../../artifactsmmo-client/spec'

interface ItemActionGroupProps {
  label: string
  action(code: string, quantity: number): void
  code: string
  quantity: number
  max?: number
}

const ItemActionGroup = ({ label, action, code, quantity, max }: ItemActionGroupProps) => {
  const [selectedQuantity, setSelectedQuantity] = useState(quantity)

  useEffect(() => {
    setSelectedQuantity(quantity)
  }, [quantity])

  return (
    <>
      <img src={`https://artifactsmmo.com/images/items/${code}.png`} alt={code} height={25} />
      <InputGroup>
        <InputGroup.Text className="w-50">{code}</InputGroup.Text>
        <InputGroup.Text className="w-50">{quantity}</InputGroup.Text>
      </InputGroup>
      <InputGroup>
        <InputGroup.Text>{label}</InputGroup.Text>
        <Form.Control
          type="number"
          value={Math.min(selectedQuantity, max ?? Number.POSITIVE_INFINITY)}
          onChange={(e) => setSelectedQuantity(Number(e.target.value))}
          max={max ?? quantity}
          min={1}
        />
        <Button onClick={() => action(code, selectedQuantity)}>Some</Button>
        <Button variant="danger" onClick={() => action(code, quantity)}>
          All
        </Button>
      </InputGroup>
    </>
  )
}

interface Props {
  character: components['schemas']['CharacterSchema']
  depositItem(code: string, quantity: number): void
  withdrawItem(code: string, quantity: number): void
}

const InventoryCard = ({ character, depositItem, withdrawItem }: Props) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'bank'>('inventory')
  const { bankItems, setPage, refetch } = useBankItems()
  const usedSlots = character.inventory?.filter((item) => item.code !== '') || []

  const inventorySize = 100 + 2 * (character.level - 1)
  const usedInventorySize = usedSlots.map((t) => t.quantity).reduce((v, acc) => v + acc, 0)
  const maxWithdraw = inventorySize - usedInventorySize

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
            <>
              {usedSlots.length === 0 && 'Empty!'}
              {usedSlots.length > 0 && (
                <ListGroup variant="flush">
                  {usedSlots.map((item) => (
                    <ListGroup.Item key={item.slot}>
                      <div className="d-flex align-items-center gap-2">
                        <ItemActionGroup
                          code={item.code}
                          quantity={item.quantity}
                          action={depositItem}
                          label="Deposit:"
                          max={item.quantity}
                        />
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
                    <ItemActionGroup
                      code={item.code}
                      quantity={item.quantity}
                      action={withdrawItem}
                      label="Withdraw:"
                      max={Math.min(item.quantity, maxWithdraw)}
                    />
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
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
            <InputGroup style={{ maxWidth: '150px' }}>
              <Form.Control
                type="number"
                value={bankItems?.page || 1}
                max={bankItems?.pages || 1}
                onChange={(e) => setPage(Number(e.target.value))}
              />
              <InputGroup.Text>of {bankItems?.pages || '?'}</InputGroup.Text>
            </InputGroup>
          </Card.Footer>
        )}
      </Card>
    </>
  )
}

export { InventoryCard }
