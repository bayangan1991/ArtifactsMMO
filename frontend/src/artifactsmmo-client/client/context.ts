import type { Client } from 'openapi-fetch'
import React from 'react'
import type { paths } from '../spec'

interface ApiClientContextType {
  client: Client<paths>
}

const ApiClientContext = React.createContext<ApiClientContextType>({
  // @ts-ignore
  client: null,
})

export { ApiClientContext }
