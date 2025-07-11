import { faBorderAll, faCoins, faSackXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Card, Table } from 'react-bootstrap'
import { Item } from '../../item/item.tsx'
import { ItemActionGroup } from '../item-action-group.tsx'
import {useCharacterActions} from "../../../hooks/use-character-actions.ts";

const Inventory = () => {
  const {
    character,
    actions: { deposit },
  } = useCharacterActions()

  if (!character) return

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
                  <ItemActionGroup code={item.code} quantity={item.quantity} action={deposit} max={item.quantity} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-between">
        <span>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth /> {character.gold.toLocaleString()}
        </span>
        <span>
          <Icon icon={faBorderAll} fixedWidth />
          {usedSlots.length || 0} / {character.inventory?.length || 0}
        </span>
        <span>
          <Icon icon={faSackXmark} fixedWidth />
          {usedInventorySize} / {character.inventory_max_items}
        </span>
      </Card.Footer>
    </Card>
  )
}

export { Inventory }
