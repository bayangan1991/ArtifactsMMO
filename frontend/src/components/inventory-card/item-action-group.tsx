import { faRepeat, faSackXmark, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useContext, useEffect, useState } from 'react'
import { Button, Dropdown, Form, InputGroup } from 'react-bootstrap'
import { useItem } from '../../artifactsmmo-client/hooks/use-item.ts'
import type { components } from '../../artifactsmmo-client/spec'
import { CharacterContext } from '../../utils/contexts/character/context.ts'

type SlotItemType =
  | 'weapon'
  | 'shield'
  | 'helmet'
  | 'body_armor'
  | 'leg_armor'
  | 'boots'
  | 'ring'
  | 'amulet'
  | 'artifact'
  | 'utility'
  | 'bag'
  | 'rune'

const SLOTS: Record<SlotItemType, components['schemas']['ItemSlot'][]> = {
  weapon: ['weapon'],
  shield: ['shield'],
  helmet: ['helmet'],
  body_armor: ['body_armor'],
  leg_armor: ['leg_armor'],
  boots: ['boots'],
  ring: ['ring1', 'ring2'],
  amulet: ['amulet'],
  artifact: ['artifact1', 'artifact2', 'artifact3'],
  utility: ['utility1', 'utility2'],
  bag: ['bag'],
  rune: ['rune'],
}

const isSlotType = (type: string): type is SlotItemType => Object.keys(SLOTS).includes(type)

interface Props {
  action(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
  code: string
  quantity: number
  max: number
}

export const ItemActionGroup = ({ action, code, quantity, max }: Props) => {
  const {
    actions: { equip, consumeItem },
  } = useContext(CharacterContext)
  const item = useItem(code)
  const [selectedQuantity, setSelectedQuantity] = useState(Math.min(quantity, max))

  useEffect(() => {
    setSelectedQuantity(Math.min(quantity, max))
  }, [quantity, max])

  const slotType = item && isSlotType(item?.type) ? item.type : null
  const equipQuantity = slotType === 'utility' ? Math.min(selectedQuantity, 100) : 1

  return (
    <InputGroup size="sm">
      {item?.type === 'consumable' && (
        <>
          <Button size="sm" variant="outline-danger" onClick={() => consumeItem(item, selectedQuantity)}>
            <Icon icon={faSackXmark} />
          </Button>
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => consumeItem(item, selectedQuantity, undefined, true)}
          >
            <Icon icon={faRepeat} />
          </Button>
        </>
      )}
      {item && slotType && SLOTS[slotType].length === 1 && (
        <Button size="sm" variant="light" onClick={() => equip(item.code, SLOTS[slotType][0], 1)}>
          <Icon icon={faUser} />
        </Button>
      )}
      {item && slotType && SLOTS[slotType].length > 1 && (
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle size="sm" variant="light">
            <Icon icon={faUser} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {SLOTS[slotType].map((slot) => (
              <Dropdown.Item key={slot} onClick={() => equip(item.code, slot, equipQuantity)}>
                {slot}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
      <Form.Control
        type="number"
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
        max={max}
        min={1}
      />
      <Button variant="primary" onClick={() => action(code, selectedQuantity)}>
        X
      </Button>
      <Button variant="warning" onClick={() => action(code, 1)}>
        1
      </Button>
      <Button variant="danger" onClick={() => action(code, quantity)}>
        All
      </Button>
      <Button variant="info" onClick={() => action(code, selectedQuantity, undefined, true)}>
        <Icon icon={faRepeat} />
      </Button>
    </InputGroup>
  )
}
