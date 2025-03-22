import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useItem = (code: string) => {
  const { client } = useContext(ApiClientContext)
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
  }, [client, code])

  return item
}

export { useItem }
