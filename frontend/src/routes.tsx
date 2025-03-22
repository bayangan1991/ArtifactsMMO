import { Route, Routes } from 'react-router'
import { AccountPage } from './pages/account-page/account-page.tsx'
import { CharacterPage } from './pages/character-page/character-page.tsx'
import { CharactersPage } from './pages/characters-page/characters-page.tsx'
import { NoAccountPage } from './pages/no-account-page.tsx'

const AppRoutes = () => (
  <Routes>
    <Route index element={<NoAccountPage />} />
    <Route path=":accountName/" element={<AccountPage />}>
      <Route index element={<CharactersPage />} />
      <Route path=":characterName/" element={<CharacterPage />} />
    </Route>
  </Routes>
)

export { AppRoutes }
