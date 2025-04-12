import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import React, { useContext } from 'react'
import { Button, Placeholder } from 'react-bootstrap'
import { Link } from 'react-router'
import { useItem } from '../../artifactsmmo-client/hooks/use-item'
import type { components } from '../../artifactsmmo-client/spec'
import { ItemModalContext } from '../../utils/contexts/modal/context.ts'

interface Props {
  code: string
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
  useHistory?: boolean
  equip?(code: string, slot: components['schemas']['ItemSlot'], quantity?: number): void
}

const SLOTS = [
  'weapon',
  'shield',
  'helmet',
  'body_armor',
  'leg_armor',
  'boots',
  'ring1',
  'ring2',
  'amulet',
  'artifact1',
  'artifact2',
  'artifact3',
  'utility1',
  'utility2',
  'bag',
  'rune',
]

const isSlotType = (type: string): type is components['schemas']['ItemSlot'] => SLOTS.includes(type)

const Item = ({ code, imgProps = { height: 25 }, useHistory = false, equip }: Props) => {
  const item = useItem(code)
  const { handleShow } = useContext(ItemModalContext)

  const itemType = item?.type || ''

  if (!item)
    return (
      <div>
        <Placeholder as="span">{code}</Placeholder>
      </div>
    )

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
      {equip && isSlotType(itemType) && (
        <Button className="ms-2" size="sm" variant="outline-light" onClick={() => equip(item.code, itemType, 1)}>
          <Icon icon={faUser} />
        </Button>
      )}
    </>
  )
}

export { Item }
