import { createFileRoute } from '@tanstack/react-router'
import { AccountPage } from '../pages/account-page/account-page.tsx'

const Route = createFileRoute('/$accountName/')({
  component: () => {
    const { accountName } = Route.useParams()
    return <AccountPage accountName={accountName} />
  },
})

export { Route }
