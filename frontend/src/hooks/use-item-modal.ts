import React, { useMemo, useState } from 'react'
import type { components } from '../artifactsmmo-client/spec'
import { Stack } from '../utils/stack.ts'

const useItemModalContext = () => {
  const [show, setShow] = useState(false)
  const [item, setItem] = useState<components['schemas']['ItemSchema'] | null>(null)
  const [history] = useState<Stack<components['schemas']['ItemSchema']>>(new Stack())

  const handleShow = (newItem: components['schemas']['ItemSchema'], useHistory = false) => {
    if (item && useHistory) history.push(item)
    if (!useHistory) history.clear()
    setItem(newItem)
    setShow(true)
  }

  const size = history.size()

  const goBack = useMemo(() => {
    if (size > 0) {
      return () => {
        const previous = history.pop()
        if (previous) setItem(previous)
      }
    }
    return null
  }, [size, history.pop])

  const handleClose = () => setShow(false)

  return { show, item, goBack, handleShow, handleClose }
}

interface ItemModalContextType {
  show: boolean
  item: components['schemas']['ItemSchema'] | null
  goBack: (() => void) | null
  handleShow(item: components['schemas']['ItemSchema'], useHistory?: boolean): void
  handleClose(): void
}

const ItemModalContext = React.createContext<ItemModalContextType | undefined>(undefined)
const ItemModalProvider = ItemModalContext.Provider

const useItemModal = () => {
  const context = React.useContext(ItemModalContext)
  if (!context) throw new Error('Must be used within a ItemModalProvider')

  return context
}

export { useItemModalContext, ItemModalProvider, useItemModal }
