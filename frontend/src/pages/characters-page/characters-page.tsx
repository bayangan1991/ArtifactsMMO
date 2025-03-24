import { Card, Col, Container, ProgressBar, Row, Stack } from 'react-bootstrap'
import { Link, useParams } from 'react-router'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'

const CharactersPage = () => {
  const { accountName } = useParams()
  const characters = useCharacters(accountName)
  return (
    <Container>
      <Row>
        <Col
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', gap: '10px', justifyContent: 'center' }}
        >
          {characters.map((character) => (
            <Card key={character.name} style={{ maxWidth: 200 }}>
              <Card.Body>
                <Link to={`${character.name}/`}>
                  <Card.Img
                    src={`https://artifactsmmo.com/images/characters/${character.skin}.png`}
                    height={100}
                    width={150}
                    style={{ maxWidth: 80 }}
                  />
                </Link>
                <Card.Title>{character.name}</Card.Title>
                <Stack gap={2}>
                  <ProgressBar
                    variant="danger"
                    max={character.max_hp}
                    now={character.hp}
                    label={`${character.hp}/${character.max_hp}`}
                  />
                  <ProgressBar
                    variant="success"
                    max={character.max_xp}
                    now={character.xp}
                    label={`${character.xp}/${character.max_xp}`}
                  />
                  <dl>
                    <dt>Level</dt>
                    <dd>{character.level}</dd>
                  </dl>
                </Stack>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  )
}

export { CharactersPage }
