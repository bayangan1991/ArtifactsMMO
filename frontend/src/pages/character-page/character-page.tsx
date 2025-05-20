import { Link } from '@tanstack/react-router'
import { Nav } from 'react-bootstrap'
import { useBankItems } from '../../artifactsmmo-client/hooks/use-bank-items.ts'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'
import { useGrandExchange } from '../../artifactsmmo-client/hooks/use-grand-exchange.ts'
import { CharacterView } from '../../components/character-view/character-view.tsx'
import { BankItemsContext } from '../../utils/contexts/bank-items/context.ts'
import { GrandExchangeContext } from '../../utils/contexts/grand-exchange/context.ts'

interface Props {
  accountName: string
  characterName: string
}

const CharacterPage = ({ accountName, characterName }: Props) => {
  const characters = useCharacters(accountName)
  const { refetch: refetchItems, ...bankItems } = useBankItems()
  const grandExchange = useGrandExchange()

  const refetch = async () => {
    await refetchItems()
  }

  return (
    <BankItemsContext.Provider value={{ ...bankItems, refetch }}>
      <GrandExchangeContext.Provider value={grandExchange}>
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
      </GrandExchangeContext.Provider>
    </BankItemsContext.Provider>
  )
}

export { CharacterPage }
