import React from 'react'
import type { components } from '../../../artifactsmmo-client/spec'

interface ItemModalContextType {
  show: boolean
  item: components['schemas']['ItemSchema'] | null
  goBack: (() => void) | null
  handleShow(item: components['schemas']['ItemSchema'], useHistory?: boolean): void
  handleClose(): void
}

const ItemModalContext = React.createContext<ItemModalContextType>({
  show: false,
  item: null,
  goBack: null,
  handleShow: () => {},
  handleClose: () => {},
})

export { ItemModalContext }
