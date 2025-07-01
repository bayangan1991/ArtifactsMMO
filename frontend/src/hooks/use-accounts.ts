import React, { useCallback, useEffect, useState } from 'react'

interface Account {
  name: string
  apiKey: string
}
const ACCOUNT_KEY = 'storage__accounts'

const useAccountsContext = () => {
  const [accounts, setAccounts] = useState<Account[]>([])

  const load = useCallback(() => {
    const account_json = localStorage.getItem('storage__accounts')
    if (account_json) setAccounts(JSON.parse(account_json))
  }, [])

  const save = useCallback(
    (newAccounts: Account[]) => {
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(newAccounts))
      load()
    },
    [load]
  )

  const findAccount = (name?: string | null) => {
    return accounts.find((account) => account.name === name) || null
  }

  useEffect(load, [])

  return { save, load, accounts, findAccount }
}

interface AccountsContextType {
  accounts: Account[]
  findAccount(name?: string): Account | null
  save(accounts: Account[]): void
  load(): void
}

const AccountsContext = React.createContext<AccountsContextType | undefined>(undefined)
const AccountsProvider = AccountsContext.Provider

const useAccounts = () => {
  const context = React.useContext(AccountsContext)
  if (!context) throw new Error('Must be used within a AccountsProvider')

  return context
}

export { useAccountsContext, AccountsProvider, useAccounts, type Account }
