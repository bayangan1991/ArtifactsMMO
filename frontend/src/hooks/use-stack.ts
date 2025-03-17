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
  const [stack] = useState<Stack<T>>(new Stack())

  return stack
}

export { useStack }
