import { Col, Container, Row } from 'react-bootstrap'
import { useCharacterActions } from '../../hooks/use-character-actions.ts'
import { CharacterContextProvider } from '../../utils/contexts/character/context.ts'
import { ActionCard } from '../action-card/action-card.tsx'
import { ActionQueueCard } from '../action-queue-card/action-queue-card.tsx'
import { CharacterCard } from '../character-card/character-card.tsx'
import { InventoryCard } from '../inventory-card/inventory-card.tsx'

interface Props {
  characterName: string
}

const CharacterView = ({ characterName }: Props) => {
  const character = useCharacterActions(characterName || null)

  return (
    <CharacterContextProvider value={character}>
      <Container fluid>
        <Row className="g-4">
          <Col md={6} lg={4} className="d-flex gap-2 flex-column">
            <CharacterCard />
            <ActionCard />
            {<ActionQueueCard />}
          </Col>
          <Col className="d-flex gap-2 flex-column">{<InventoryCard />}</Col>
        </Row>
      </Container>
    </CharacterContextProvider>
  )
}

export { CharacterView }
