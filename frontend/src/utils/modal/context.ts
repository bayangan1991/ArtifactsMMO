import React from 'react'
import type { components } from '../../artifactsmmo-client/spec'

interface ItemModalContextType {
  show: boolean
  item: components['schemas']['ItemSchema'] | null
  handleShow(item: components['schemas']['ItemSchema']): void
  handleClose(): void
}

const ItemModalContext = React.createContext<ItemModalContextType>({
  show: false,
  item: null,
  handleShow: () => {},
  handleClose: () => {},
})

export { ItemModalContext }
