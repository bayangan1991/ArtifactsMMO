import { useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useResource = (code: string) => {
  const { client } = useContext(ApiClientContext)
  const [resource, setResource] = useState<components['schemas']['ResourceSchema'] | null>(null)

  useEffect(() => {
    client
      .GET('/resources/{code}', { params: { path: { code } } })
      .then((result) => {
        if (result.data) {
          setResource(result.data.data)
        } else {
          setResource(null)
        }
      })
      .catch(() => setResource(null))
  }, [client, code])

  return resource
}

export { useResource }
