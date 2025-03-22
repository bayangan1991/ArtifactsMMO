import './App.scss'
import { Container, Navbar } from 'react-bootstrap'
import { ApiClientContext } from './artifactsmmo-client/client/context.ts'
import { useClient } from './artifactsmmo-client/client/hooks.ts'
import { AccountPage } from './pages/account-page/account-page.tsx'

function App() {
  const account = {
    name: 'Bayangan',
    apiKey: '',
  }
  const context = useClient(account.apiKey)

  return (
    <ApiClientContext.Provider value={context}>
      <Navbar data-bs-theme="dark" bg="dark" fixed="top">
        <Container fluid className="gap-2">
          <Navbar.Brand>Artifacts MMO Client</Navbar.Brand>
        </Container>
      </Navbar>
      <AccountPage account={account} />
    </ApiClientContext.Provider>
  )
}

export default App
