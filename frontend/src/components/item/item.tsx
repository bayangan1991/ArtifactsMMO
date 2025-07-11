import React from 'react'
import { Button, Placeholder } from 'react-bootstrap'
import { useItem } from '../../artifactsmmo-client/hooks/use-item.ts'
import { useItemModal } from '../../hooks/use-item-modal.ts'

interface Props {
  code: string
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
  useHistory?: boolean
}

const Item = ({ code, imgProps = { height: 25 }, useHistory = false }: Props) => {
  const { data: item } = useItem({ code })
  const { handleShow } = useItemModal()

  if (!item)
    return (
      <div className="d-inline-block">
        <Placeholder as="span">{code}</Placeholder>
      </div>
    )

  return (
    <>
      <Button
        as={'a'}
        href="#"
        className="text-decoration-none text-light"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleShow(item, useHistory)
        }}
      >
        <img {...imgProps} src={`https://artifactsmmo.com/images/items/${code}.png`} alt={code} />
        <span className="ms-2">{item.name}</span>
      </Button>
    </>
  )
}

export { Item }
