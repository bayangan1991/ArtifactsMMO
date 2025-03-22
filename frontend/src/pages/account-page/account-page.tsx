import { useContext } from 'react'
import { Outlet, useParams } from 'react-router'
import { ApiClientContext } from '../../artifactsmmo-client/client/context.ts'
import { useClient } from '../../artifactsmmo-client/client/hooks.ts'
import { AccountContext } from '../../utils/accounts/context.ts'

const AccountPage = () => {
  const { accountName } = useParams()
  const { findAccount } = useContext(AccountContext)
  const activeAccount = findAccount(accountName)
  const apiClientContext = useClient(activeAccount?.apiKey)

  return (
    <ApiClientContext.Provider value={apiClientContext}>
      <Outlet />
    </ApiClientContext.Provider>
  )
}

export { AccountPage }
