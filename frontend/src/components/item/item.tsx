import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { Button, Dropdown, Placeholder } from 'react-bootstrap'
import { Link } from 'react-router'
import { useItem } from '../../artifactsmmo-client/hooks/use-item'
import type { components } from '../../artifactsmmo-client/spec'
import { ItemModalContext } from '../../utils/contexts/modal/context.ts'

interface Props {
  code: string
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
  useHistory?: boolean
  equip?(code: string, slot: components['schemas']['ItemSlot'], quantity?: number): void
  quantity?: number
}

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

const Item = ({ code, imgProps = { height: 25 }, useHistory = false, equip, quantity = 1 }: Props) => {
  const item = useItem(code)
  const { handleShow } = useContext(ItemModalContext)

  const itemType = item?.type || ''

  if (!item)
    return (
      <div className="d-inline-block">
        <Placeholder as="span">{code}</Placeholder>
      </div>
    )

  const adjustedQuantity = itemType === 'utility' ? Math.min(quantity, 100) : 1

  return (
    <>
      <Link
        to="#"
        className="text-decoration-none text-light"
        onClick={() => {
          handleShow(item, useHistory)
        }}
      >
        <img {...imgProps} src={`https://artifactsmmo.com/images/items/${code}.png`} alt={code} />
        <span className="ms-2">{item.name}</span>
      </Link>
      {equip && isSlotType(itemType) && SLOTS[itemType].length === 1 && (
        <Button
          className="ms-2"
          size="sm"
          variant="outline-light"
          onClick={() => equip(item.code, SLOTS[itemType][0], 1)}
        >
          <Icon icon={faUser} />
        </Button>
      )}
      {equip && isSlotType(itemType) && SLOTS[itemType].length > 1 && (
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle className="ms-2" size="sm" variant="outline-light">
            <Icon icon={faUser} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {SLOTS[itemType].map((slot) => (
              <Dropdown.Item key={slot} onClick={() => equip(item.code, slot, adjustedQuantity)}>
                {slot}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </>
  )
}

export { Item }
