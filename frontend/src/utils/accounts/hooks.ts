import { useCallback, useEffect, useState } from 'react'
import type { Account } from './types.ts'

const ACCOUNT_KEY = 'storage__accounts'

const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [activeAccount, setActiveAccount] = useState<Account | null>(null)

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

  useEffect(load, [])

  return { save, load, accounts, activeAccount, setActiveAccount }
}

export { useAccounts }
