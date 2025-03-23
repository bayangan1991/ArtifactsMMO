import { Route, Routes } from 'react-router'
import App from './App.tsx'
import { AccountPage } from './pages/account-page/account-page.tsx'
import { CharacterPage } from './pages/character-page/character-page.tsx'
import { CharactersPage } from './pages/characters-page/characters-page.tsx'
import { NoAccountPage } from './pages/no-account-page.tsx'

const AppRoutes = () => {
  console.log('test')

  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<NoAccountPage />} />
        <Route path=":accountName/" element={<AccountPage />}>
          <Route index element={<CharactersPage />} />
          <Route path=":characterName/" element={<CharacterPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export { AppRoutes }
