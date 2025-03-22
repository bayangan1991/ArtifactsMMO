import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import App from './App.tsx'
import { AppRoutes } from './routes.tsx'

// biome-ignore lint/style/noNonNullAssertion: It's the root!
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/*" element={<AppRoutes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
