import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router'
import { AppRoutes } from './routes.tsx'

// biome-ignore lint/style/noNonNullAssertion: It's the root!
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
