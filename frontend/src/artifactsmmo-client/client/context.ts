import type { Client } from 'openapi-fetch'
import React from 'react'
import type { paths } from '../spec'

interface ApiClientContextType {
  client: Client<paths>
  getCache<T>(name: string): Record<string, T>
}

const notImplemented = () => {
  throw new Error('Function not implemented.')
}

const ApiClientContext = React.createContext<ApiClientContextType>({
  // @ts-ignore
  client: null,
  getCache: notImplemented,
})

export { ApiClientContext }
