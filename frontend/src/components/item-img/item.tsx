import React, { useContext } from 'react'
import { Placeholder } from 'react-bootstrap'
import { Link } from 'react-router'
import { useItem } from '../../artifactsmmo-client/hooks/use-item'
import { ItemModalContext } from '../../utils/modal/context.ts'

interface Props {
  code: string
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>
}

const Item = ({ code, imgProps = { height: 25 } }: Props) => {
  const item = useItem(code)
  const { handleShow } = useContext(ItemModalContext)

  if (!item)
    return (
      <div>
        <Placeholder as="span">{code}</Placeholder>
      </div>
    )

  return (
    <Link
      to="#"
      className="text-decoration-none text-light"
      onClick={() => {
        handleShow(item)
      }}
    >
      <img {...imgProps} src={`https://artifactsmmo.com/images/items/${code}.png`} alt={code} />
      <span className="ms-2">{item.name}</span>
    </Link>
  )
}

export { Item }
