import {} from '@fortawesome/free-solid-svg-icons'
import { Card, Nav } from 'react-bootstrap'
import { Link, useParams } from 'react-router'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'
import { CharacterView } from '../../components/character-view/character-view.tsx'
import type {} from '../../types.ts'

const CharacterPage = () => {
  const { accountName, characterName } = useParams<{ accountName: string; characterName: string }>()
  const characters = useCharacters(accountName)

  return (
    <Card className="mx-2" style={{ height: 'calc(100vh - 80px)' }}>
      <Card.Header>
        <Nav variant="pills" defaultActiveKey={characterName}>
          {characters.map((char) => (
            <Nav.Item key={char.name}>
              <Nav.Link as={Link} to={`/${accountName}/${char.name}/`} eventKey={char.name}>
                {char.name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Card.Header>
      <Card.Body>
        {characters.map((char) => (
          <div className={characterName === char.name ? '' : 'd-none'} key={char.name}>
            <CharacterView characterName={char.name} />
          </div>
        ))}
      </Card.Body>
    </Card>
  )
}

export { CharacterPage }
