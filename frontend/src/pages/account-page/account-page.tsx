import { CharactersPage } from '../characters-page/characters-page.tsx'

interface Props {
  accountName: string
}

const AccountPage = ({ accountName }: Props) => <CharactersPage accountName={accountName} />

export { AccountPage }
