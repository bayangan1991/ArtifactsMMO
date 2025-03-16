import { useCallback, useRef, useState } from 'react'

const useStack = <T>() => {
  const [stack, setStack] = useState<T[]>([])

  const stackRef = useRef(stack)

  const pushLeft = useCallback((item: T) => {
    setStack((s) => [item, ...s])
  }, [])

  const pushRight = useCallback((item: T) => {
    setStack((s) => {
      return [...s, item]
    })
  }, [])

  const popLeft = useCallback(() => {
    const item = stack[0] || null
    setStack((s) => {
      return [...s.slice(1)]
    })
    return item
  }, [stack])

  const popRight = useCallback(() => {
    const item = stack[stackRef.current.length - 1]
    setStack((s) => {
      return [...s.slice(0, -1)]
    })
    return item
  }, [stack])

  return { stack, pushLeft, pushRight, popLeft, popRight }
}

export { useStack }
