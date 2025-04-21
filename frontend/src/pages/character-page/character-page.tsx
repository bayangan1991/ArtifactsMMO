import { Nav } from 'react-bootstrap'
import { Link, useParams } from 'react-router'
import { useBankDetails } from '../../artifactsmmo-client/hooks/use-bank-details.ts'
import { useBankItems } from '../../artifactsmmo-client/hooks/use-bank-items.ts'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'
import { CharacterView } from '../../components/character-view/character-view.tsx'
import { BankItemsContext } from '../../utils/contexts/bank-items/context.ts'

const CharacterPage = () => {
  const { accountName, characterName } = useParams<{ accountName: string; characterName: string }>()
  const characters = useCharacters(accountName)
  const { refetch: refetchItems, ...bankItems } = useBankItems()
  const { refetch: refetchDetail, ...bankDetails } = useBankDetails()

  const refetch = async () => {
    await refetchDetail()
    await refetchItems()
  }

  return (
    <BankItemsContext.Provider value={{ ...bankItems, ...bankDetails, refetch }}>
      <Nav variant="underline" defaultActiveKey={characterName} className="mx-3 mb-3">
        {characters.map((char) => (
          <Nav.Item key={char.name}>
            <Nav.Link as={Link} to={`/${accountName}/${char.name}/`} eventKey={char.name}>
              <img
                style={{ maxWidth: 15 }}
                src={`https://www.artifactsmmo.com/images/characters/${char.skin}.png`}
                className="me-1"
                alt={char.name}
              />
              {char.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      {characters.map((char) => (
        <div className={characterName === char.name ? '' : 'd-none'} key={char.name}>
          <CharacterView characterName={char.name} />
        </div>
      ))}
    </BankItemsContext.Provider>
  )
}

export { CharacterPage }
