import './App.scss'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { ApiClientProvider, useApiClientContext } from './artifactsmmo-client/use-api-client/use-api-client.ts'
import { AccountsModal } from './components/modals/accounts-modal.tsx'
import { ItemModal } from './components/modals/item-modal.tsx'
import { AccountsProvider, useAccountsContext } from './hooks/use-accounts.ts'
import { ItemModalProvider, useItemModalContext } from './hooks/use-item-modal.ts'
import { NoAccountPage } from './pages/no-account-page.tsx'

const queryClient = new QueryClient()

const App = () => {
  const { accountName } = useParams({ strict: false })
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false)
  const accountContext = useAccountsContext()
  const activeAccount = accountContext.findAccount(accountName)
  const apiClientContext = useApiClientContext(activeAccount?.apiKey)
  const itemModalContext = useItemModalContext()

  return (
    <ApiClientProvider value={apiClientContext}>
      <QueryClientProvider client={queryClient}>
        <AccountsProvider value={accountContext}>
          <ItemModalProvider value={itemModalContext}>
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
            {itemModalContext.show && itemModalContext.item && (
              <ItemModal
                show={itemModalContext.show}
                item={itemModalContext.item}
                handleClose={itemModalContext.handleClose}
              />
            )}
            {!activeAccount && <NoAccountPage />}
            {activeAccount && (
              <Container fluid className="px-0 pt-3">
                <Outlet />
              </Container>
            )}
          </ItemModalProvider>
        </AccountsProvider>
      </QueryClientProvider>
    </ApiClientProvider>
  )
}

export default App
