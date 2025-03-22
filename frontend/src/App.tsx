import './App.scss'
import { useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { ApiClientContext } from './artifactsmmo-client/client/context.ts'
import { useClient } from './artifactsmmo-client/client/hooks.ts'
import { AccountsModal } from './components/modals/accounts-modal.tsx'
import { AccountPage } from './pages/account-page/account-page.tsx'
import { AccountContext } from './utils/accounts/context.ts'
import { useAccounts } from './utils/accounts/hooks.ts'

function App() {
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false)
  const accountContext = useAccounts()
  const clientContext = useClient(accountContext.activeAccount?.apiKey)

  return (
    <AccountContext.Provider value={accountContext}>
      <ApiClientContext.Provider value={clientContext}>
        {showAccountsModal && (
          <AccountsModal
            show={showAccountsModal}
            handleClose={() => {
              setShowAccountsModal(false)
            }}
          />
        )}
        <Navbar data-bs-theme="dark" bg="dark" fixed="top">
          <Container fluid className="gap-2">
            <Navbar.Brand>Artifacts MMO Client</Navbar.Brand>
            <Button variant="warning" onClick={() => setShowAccountsModal(true)}>
              Accounts
            </Button>
          </Container>
        </Navbar>
        <AccountPage />
      </ApiClientContext.Provider>
    </AccountContext.Provider>
  )
}

export default App
