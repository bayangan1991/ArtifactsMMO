import React from 'react'
import type { components } from '../../../artifactsmmo-client/spec'
import type { PaginationType } from '../../../types.ts'

interface BankItemsContextType {
  bankItems: components['schemas']['DataPage_SimpleItemSchema_'] | null
  pagination: PaginationType
  refetch(): Promise<void>
  filter: string | null
  setFilter(filter: string): void
}

const BankItemsContext = React.createContext<BankItemsContextType>({
  bankItems: null,
  pagination: { page: 1, pages: 1, setPage: () => null },
  refetch: async () => new Promise(() => null),
  filter: null,
  setFilter: (): void => {},
})

export { BankItemsContext }
