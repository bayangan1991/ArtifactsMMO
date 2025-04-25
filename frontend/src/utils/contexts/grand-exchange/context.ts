import React from 'react'
import type { components } from '../../../artifactsmmo-client/spec'
import type { PaginationType } from '../../../types.ts'

interface GrandExchangeContextType {
  grandExchange: components['schemas']['DataPage_GEOrderSchema_'] | null
  pagination: PaginationType
  refetch(): Promise<void>
  filter: string | null
  setFilter(filter: string): void
}

const GrandExchangeContext = React.createContext<GrandExchangeContextType>({
  grandExchange: null,
  pagination: { page: 1, pages: 1, setPage: () => null },
  refetch: async () => new Promise(() => null),
  filter: null,
  setFilter: (): void => {},
})

export { GrandExchangeContext }
