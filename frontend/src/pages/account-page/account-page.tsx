import { useContext } from 'react'
import { Outlet, useParams } from 'react-router'
import { ApiClientContext } from '../../artifactsmmo-client/client/context.ts'
import { useClient } from '../../artifactsmmo-client/client/hooks.ts'
import { ItemModal } from '../../components/modals/item-modal.tsx'
import { AccountContext } from '../../utils/contexts/accounts/context.ts'
import { ItemModalContext } from '../../utils/contexts/modal/context.ts'
import { useItemModal } from '../../utils/contexts/modal/hooks.ts'
import { NoAccountPage } from '../no-account-page.tsx'

const AccountPage = () => {
  const { accountName } = useParams()
  const { findAccount } = useContext(AccountContext)
  const activeAccount = findAccount(accountName)
  const apiClientContext = useClient(activeAccount?.apiKey)
  const itemModalContext = useItemModal()

  return (
    <>
      {!activeAccount && <NoAccountPage />}
      {activeAccount && (
        <ApiClientContext.Provider value={apiClientContext}>
          <ItemModalContext.Provider value={itemModalContext}>
            {itemModalContext.show && itemModalContext.item && (
              <ItemModal
                show={itemModalContext.show}
                item={itemModalContext.item}
                handleClose={itemModalContext.handleClose}
              />
            )}
            <Outlet />
          </ItemModalContext.Provider>
        </ApiClientContext.Provider>
      )}
    </>
  )
}

export { AccountPage }
