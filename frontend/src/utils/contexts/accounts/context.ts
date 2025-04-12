import React from 'react'
import type { Account } from './types.ts'

interface AccountContextType {
  accounts: Account[]
  findAccount(name?: string): Account | null
  save(accounts: Account[]): void
  load(): void
}

const AccountContext = React.createContext<AccountContextType>({
  accounts: [],
  findAccount: () => null,
  save: () => null,
  load: () => null,
})

export { AccountContext }
