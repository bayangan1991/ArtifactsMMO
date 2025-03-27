import { useState } from 'react'
import type { components } from '../../artifactsmmo-client/spec'

const useItemModal = () => {
  const [show, setShow] = useState(false)
  const [item, setItem] = useState<components['schemas']['ItemSchema'] | null>(null)

  const handleShow = (item: components['schemas']['ItemSchema']) => {
    setItem(item)
    setShow(true)
  }

  const handleClose = () => setShow(false)

  return { show, item, handleShow, handleClose }
}

export { useItemModal }
