import { createRootRoute } from '@tanstack/react-router'
import App from '../App.tsx'

const Route = createRootRoute({
  component: App,
})

export { Route }
