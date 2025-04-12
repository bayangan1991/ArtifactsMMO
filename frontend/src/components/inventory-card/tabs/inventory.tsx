import { Card, Table } from 'react-bootstrap'
import type { components } from '../../../artifactsmmo-client/spec'
import { Item } from '../../item/item.tsx'
import { ItemActionGroup } from '../item-action-group.tsx'

interface Props {
  character: components['schemas']['CharacterSchema']
  action(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
}

const Inventory = ({ character, action }: Props) => {
  const usedSlots = character.inventory?.filter((item) => item.code !== '') || []

  const usedInventorySize = usedSlots.map((t) => t.quantity).reduce((v, acc) => v + acc, 0)

  return (
    <Card>
      <Card.Body>
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
                  <ItemActionGroup code={item.code} quantity={item.quantity} action={action} max={item.quantity} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <span>
          {usedSlots.length || 0} / {character.inventory?.length || 0}
        </span>
        <span>
          {usedInventorySize} / {character.inventory_max_items}
        </span>
      </Card.Footer>
    </Card>
  )
}

export { Inventory }
