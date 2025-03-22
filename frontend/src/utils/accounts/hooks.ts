import { useCallback, useEffect, useState } from 'react'
import type { Account } from './types.ts'

const ACCOUNT_KEY = 'storage__accounts'

const useAccounts = () => {
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

  const findAccount = (name: string) => {
    return accounts.find((account) => account.name === name) || null
  }

  useEffect(load, [])

  return { save, load, accounts, findAccount }
}

export { useAccounts }
