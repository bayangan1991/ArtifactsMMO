import { useMemo, useState } from 'react'
import type { components } from '../../../artifactsmmo-client/spec'
import { Stack } from '../../stack.ts'

const useItemModal = () => {
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

export { useItemModal }
