import './App.scss'
import { Container, Navbar } from 'react-bootstrap'
import { AccountPage } from './pages/account-page/account-page.tsx'

function App() {
  const account = { name: 'Bayangan', apiKey: '' }

  return (
    <>
      <Navbar data-bs-theme="dark" bg="dark" fixed="top">
        <Container fluid className="gap-2">
          <Navbar.Brand>Artifacts MMO Client</Navbar.Brand>
        </Container>
      </Navbar>
      <AccountPage account={account} />
    </>
  )
}

export default App
