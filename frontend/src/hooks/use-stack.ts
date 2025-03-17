import { useState } from 'react'

interface IStack<T> {
  push(item: T): void
  pop(): T | undefined
  size(): number
  data(): T[]
}

class Stack<T> implements IStack<T> {
  private _data: T[] = []

  push(item: T): void {
    this._data.push(item)
  }

  pop(): T | undefined {
    return this._data.shift()
  }

  size(): number {
    return this._data.length
  }

  data(): T[] {
    return this._data
  }

  static clone = <T>(data: T[]): Stack<T> => {
    const stack = new Stack<T>()
    data.forEach((item) => stack.push(item))

    return stack
  }
}

const useStack = <T>() => {
  const [stack, setStack] = useState<Stack<T>>(new Stack())

  const pushRight = (item: T) => {
    const newStack = Stack.clone(stack.data())
    newStack.push(item)
    setStack(newStack)
  }

  const popLeft = () => {
    const newStack = Stack.clone(stack.data())
    const poppedItem = newStack.pop() || null
    setStack(newStack)
    return poppedItem
  }

  return { stack, pushRight, popLeft }
}

export { useStack }
