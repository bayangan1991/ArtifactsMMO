interface IStack<T> {
  push(item: T): void
  pop(): T | undefined
  remove(i: number): void
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

  remove = (i: number): void => {
    const left = this._data.slice(0, i)
    const right = this._data.slice(i + 1)
    this._data = [...left, ...right]
  }

  size(): number {
    return this._data.length
  }

  data(): T[] {
    return this._data
  }

  static clone = <T>(data: T[]): Stack<T> => {
    const stack = new Stack<T>()
    // biome-ignore lint/complexity/noForEach: I don't want to rewrite it
    data.forEach((item) => stack.push(item))

    return stack
  }
}

export { Stack }
