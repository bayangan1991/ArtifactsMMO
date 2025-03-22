import './App.scss'
import { useEffect, useState } from 'react'
import { Button, Container, Navbar } from 'react-bootstrap'
import { ApiClientContext } from './artifactsmmo-client/client/context.ts'
import { useClient } from './artifactsmmo-client/client/hooks.ts'
import { AccountsModal } from './components/modals/accounts-modal.tsx'
import { type Account, useAccounts } from './hooks/use-accounts.ts'
import { AccountPage } from './pages/account-page/account-page.tsx'

function App() {
  const [showAccountsModal, setShowAccountsModal] = useState<boolean>(false)

  const { accounts, save } = useAccounts()
  const [account, setAccount] = useState<Account | null>(null)

  useEffect(() => {
    if (!account && !!accounts.length) {
      setAccount(accounts[0])
    }
  })

  const context = useClient(account?.apiKey)

  const handleSave = (accounts: Account[], active: Account) => {
    save(accounts)
    setAccount(active)
    setShowAccountsModal(false)
  }

  return (
    <ApiClientContext.Provider value={context}>
      {showAccountsModal && (
        <AccountsModal
          show={showAccountsModal}
          handleSave={handleSave}
          handleClose={() => {
            setShowAccountsModal(false)
          }}
          accounts={accounts}
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
      {account && <AccountPage account={account} />}
    </ApiClientContext.Provider>
  )
}

export default App
