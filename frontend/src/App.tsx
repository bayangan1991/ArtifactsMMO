import './App.scss'
import { useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { Outlet } from 'react-router'
import { AccountsModal } from './components/modals/accounts-modal.tsx'
import { AccountContext } from './utils/accounts/context.ts'
import { useAccounts } from './utils/accounts/hooks.ts'

const App = () => {
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false)
  const accountContext = useAccounts()

  return (
    <AccountContext.Provider value={accountContext}>
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
      <Container fluid className="px-0 pt-3">
        <Outlet />
      </Container>
    </AccountContext.Provider>
  )
}

export default App
