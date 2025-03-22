import { useEffect, useState } from 'react'

const ACCOUNT_KEY = 'storage__accounts'

interface Account {
  name: string
  apiKey: string
}

const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])

  const save = () => {
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts))
  }

  const load = () => {
    const account_json = localStorage.getItem('storage__accounts')
    if (account_json) setAccounts(JSON.parse(account_json))
  }

  useEffect(load, [])

  return { save, load, accounts }
}

export { useAccounts, type Account }
