import { Link } from '@tanstack/react-router'
import { Card, Col, Container, ProgressBar, Row, Stack } from 'react-bootstrap'
import { useCharacters } from '../../artifactsmmo-client/hooks/use-characters.ts'

interface Props {
  accountName: string
}

const CharactersPage = ({ accountName }: Props) => {
  const { data: characters } = useCharacters({ account: accountName })
  return (
    <Container>
      <Row>
        <Col lg={2} />
        <Col lg={8}>
          <Row className="d-flex">
            {characters?.map((character) => (
              <Col lg={4} key={character.name} className="p-2 d-flex justify-content-center align-items-center">
                <Card style={{ maxWidth: 200, width: '100%', margin: 'auto' }}>
                  <Card.Body>
                    <Link to="/$accountName/$characterName" params={{ accountName, characterName: character.name }}>
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
              </Col>
            ))}
          </Row>
        </Col>
        <Col lg={2} />
      </Row>
    </Container>
  )
}

export { CharactersPage }
