import { useEffect, useState } from 'react'
import { client } from '../client.ts'
import type { components } from '../spec'

const useItem = (code: string) => {
  const [item, setItem] = useState<components['schemas']['ItemSchema'] | null>(null)

  useEffect(() => {
    client
      .GET('/items/{code}', { params: { path: { code } } })
      .then((result) => {
        if (result.data) {
          setItem(result.data.data)
        } else {
          setItem(null)
        }
      })
      .catch(() => setItem(null))
  }, [code])

  return item
}

export { useItem }
