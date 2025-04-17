import type { Client } from 'openapi-fetch'
import React from 'react'
import type { paths } from '../spec'

interface ApiClientContextType {
  client: Client<paths>
  getCache<T, K extends string | number | symbol = string>(name: string): Record<K, T>
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
