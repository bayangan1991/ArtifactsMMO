import { createFileRoute } from '@tanstack/react-router'
import { CharacterPage } from '../../../pages/character-page/character-page.tsx'

const Route = createFileRoute('/$accountName/$characterName/')({
  component: () => {
    const { accountName, characterName } = Route.useParams()
    return <CharacterPage accountName={accountName} characterName={characterName} />
  },
})

export { Route }
