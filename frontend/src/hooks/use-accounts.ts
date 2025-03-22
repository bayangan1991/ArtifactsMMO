import { useCallback, useEffect, useState } from 'react'

const ACCOUNT_KEY = 'storage__accounts'

interface Account {
  name: string
  apiKey: string
}

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

  useEffect(load, [])

  return { save, load, accounts }
}

export { useAccounts, type Account }
