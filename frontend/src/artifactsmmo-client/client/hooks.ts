import createClient, { type Middleware } from 'openapi-fetch'
import { useEffect, useState } from 'react'
import type { paths } from '../spec'

const useClient = (apiKey: string) => {
  const [client] = useState(createClient<paths>({ baseUrl: 'https://api.artifactsmmo.com/' }))
  const [authMiddleware, setAuthMiddleware] = useState<Middleware | null>(null)

  useEffect(() => {
    setAuthMiddleware({
      async onRequest({ request }) {
        request.headers.set('Authorization', `Bearer ${apiKey}`)
        return request
      },
    })
  }, [apiKey])

  useEffect(() => {
    if (authMiddleware) client.use(authMiddleware)
    return () => {
      if (authMiddleware) client.eject(authMiddleware)
    }
  }, [client, authMiddleware])

  return { client }
}

export { useClient }
