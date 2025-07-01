import { createFileRoute } from '@tanstack/react-router'
import { NoAccountPage } from '../pages/no-account-page/no-account-page.tsx'

export const Route = createFileRoute('/')({
  component: NoAccountPage,
})
