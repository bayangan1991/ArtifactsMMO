import { Link } from '@tanstack/react-router'
import { Nav } from 'react-bootstrap'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'
import { CharacterView } from '../../components/character-view/character-view.tsx'

interface Props {
  accountName: string
  characterName: string
}

const CharacterPage = ({ accountName, characterName }: Props) => {
  const { data: characters } = useCharacters({ account: accountName })

  return (
    <>
      <Nav variant="underline" defaultActiveKey={characterName} className="mx-3 mb-3">
        {characters?.map((char) => (
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
      {characters?.map((char) => (
        <div className={characterName === char.name ? '' : 'd-none'} key={char.name}>
          <CharacterView characterName={char.name} />
        </div>
      ))}
    </>
  )
}

export { CharacterPage }
