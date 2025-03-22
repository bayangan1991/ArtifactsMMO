import { Container, ListGroup } from 'react-bootstrap'
import { Link, useParams } from 'react-router'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'

const CharactersPage = () => {
  const { accountName } = useParams()
  const characters = useCharacters(accountName)
  return (
    <Container>
      <ListGroup>
        {characters.map((character) => (
          <ListGroup.Item key={character.name}>
            <Link to={`${character.name}/`}>{character.name}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  )
}

export { CharactersPage }
