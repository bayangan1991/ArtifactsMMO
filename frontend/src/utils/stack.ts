interface IStack<T> {
  push(item: T): void
  pop(): T | undefined
  insert(item: T, i: number): void
  remove(i: number): void
  size(): number
  data(): T[]
}

class Stack<T> implements IStack<T> {
  private _data: T[] = []

  push = (item: T): void => {
    this._data.push(item)
  }

  pop = (): T | undefined => this._data.shift()

  insert = (item: T, i: number) => {
    const left = this._data.slice(0, i)
    const right = this._data.slice(i)
    this._data = [...left, item, ...right]
  }

  remove = (i: number): void => {
    const left = this._data.slice(0, i)
    const right = this._data.slice(i + 1)
    this._data = [...left, ...right]
  }

  size = (): number => this._data.length

  data = (): T[] => this._data
}

export { Stack }
