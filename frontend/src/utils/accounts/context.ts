import React from 'react'
import type { Account } from './types.ts'

interface AccountContextType {
  accounts: Account[]
  activeAccount: Account | null
  setActiveAccount(account: Account | null): void
  save(accounts: Account[]): void
  load(): void
}

const AccountContext = React.createContext<AccountContextType>({
  accounts: [],
  activeAccount: null,
  setActiveAccount: () => null,
  save: () => null,
  load: () => null,
})

export { AccountContext }
