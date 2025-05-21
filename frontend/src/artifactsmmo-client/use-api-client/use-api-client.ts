import createClient, { type Client, type Middleware } from 'openapi-fetch'
import { useEffect, useState } from 'react'
import React from 'react'
import type { paths } from '../spec'

const CORSMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set('Access-Control-Allow-Origin', '*')
    return request
  },
}

const useApiClientContext = (apiKey?: string) => {
  const [client] = useState(createClient<paths>({ baseUrl: 'https://api.artifactsmmo.com/' }))
  const [authMiddleware, setAuthMiddleware] = useState<Middleware | null>(null)

  client.use(CORSMiddleware)

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

interface ApiClientContextType {
  client: Client<paths>
}

const ApiClientContext = React.createContext<ApiClientContextType | undefined>(undefined)
const ApiClientProvider = ApiClientContext.Provider

const useApiClient = () => {
  const context = React.useContext(ApiClientContext)
  if (!context) {
    throw new Error('useClient must be used within a ApiClientContextProvider')
  }
  return context
}

export { useApiClientContext, useApiClient, ApiClientProvider }
