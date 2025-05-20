import './App.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { ApiClientContext } from './artifactsmmo-client/client/context.ts'
import { useClient } from './artifactsmmo-client/client/hooks.ts'
import { AccountsModal } from './components/modals/accounts-modal.tsx'
import { NoAccountPage } from './pages/no-account-page.tsx'
import { AccountContext } from './utils/contexts/accounts/context.ts'
import { useAccounts } from './utils/contexts/accounts/hooks.ts'
import { ItemModalContext } from './utils/contexts/modal/context.ts'
import { useItemModal } from './utils/contexts/modal/hooks.ts'

const queryClient = new QueryClient()

const App = () => {
  const { accountName } = useParams({ strict: false })
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false)
  const accountContext = useAccounts()
  const activeAccount = accountContext.findAccount(accountName)
  const apiClientContext = useClient(activeAccount?.apiKey)
  const itemModalContext = useItemModal()

  return (
    <ApiClientContext.Provider value={apiClientContext}>
      <QueryClientProvider client={queryClient}>
        <AccountContext.Provider value={accountContext}>
          <ItemModalContext.Provider value={itemModalContext}>
            <Navbar bg="black" fixed="top">
              <Container fluid className="gap-2">
                <Navbar.Brand>
                  <img
                    src="logo.svg"
                    width="30"
                    height="30"
                    className="d-inline-block align-top me-2"
                    alt="React Bootstrap logo"
                  />
                  Artifacts MMO Client
                </Navbar.Brand>
                <Button variant="warning" onClick={() => setShowAccountsModal(true)}>
                  Accounts
                </Button>
              </Container>
            </Navbar>
            {showAccountsModal && (
              <AccountsModal
                show={showAccountsModal}
                handleClose={() => {
                  setShowAccountsModal(false)
                }}
              />
            )}
            {!activeAccount && <NoAccountPage />}
            {activeAccount && (
              <Container fluid className="px-0 pt-3">
                <Outlet />
              </Container>
            )}
          </ItemModalContext.Provider>
        </AccountContext.Provider>
      </QueryClientProvider>
    </ApiClientContext.Provider>
  )
}

export default App
