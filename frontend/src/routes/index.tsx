import { createFileRoute } from '@tanstack/react-router'
import { NoAccountPage } from '../pages/no-account-page.tsx'

const Route = createFileRoute('/')({
  component: NoAccountPage,
})

export { Route }
