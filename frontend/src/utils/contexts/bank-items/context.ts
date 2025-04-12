import React from 'react'
import type { components } from '../../../artifactsmmo-client/spec'
import type { PaginationType } from '../../../types.ts'

interface BankItemsContextType {
  bankDetails: components['schemas']['BankResponseSchema'] | null
  bankItems: components['schemas']['DataPage_SimpleItemSchema_'] | null
  pagination: PaginationType
  refetch(): Promise<void>
}

const BankItemsContext = React.createContext<BankItemsContextType>({
  bankDetails: null,
  bankItems: null,
  pagination: { page: 1, pages: 1, setPage: () => null },
  refetch: async () => new Promise(() => null),
})

export { BankItemsContext }
