import { Link } from '@tanstack/react-router'
import React, { useContext } from 'react'
import { Placeholder } from 'react-bootstrap'
import { useItem } from '../../artifactsmmo-client/hooks/use-item.ts'
import { ItemModalContext } from '../../utils/contexts/modal/context.ts'

interface Props {
  code: string
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
  useHistory?: boolean
}

const Item = ({ code, imgProps = { height: 25 }, useHistory = false }: Props) => {
  const { data: item } = useItem({ code })
  const { handleShow } = useContext(ItemModalContext)

  if (!item)
    return (
      <div className="d-inline-block">
        <Placeholder as="span">{code}</Placeholder>
      </div>
    )

  return (
    <>
      <Link
        to="#"
        className="text-decoration-none text-light"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleShow(item, useHistory)
        }}
      >
        <img {...imgProps} src={`https://artifactsmmo.com/images/items/${code}.png`} alt={code} />
        <span className="ms-2">{item.name}</span>
      </Link>
    </>
  )
}

export { Item }
