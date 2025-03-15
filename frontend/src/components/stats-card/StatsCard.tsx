import { Button, Card, ProgressBar } from 'react-bootstrap'
import type { components } from '../../artifactsmmo-client/spec'

interface Props {
  character: components['schemas']['CharacterSchema'] | null
  ready: boolean
  doRest: () => Promise<null>
}

const StatsCard = ({ character, doRest, ready }: Props) => (
  <Card>
    <Card.Body className="d-flex flex-column gap-2">
      <Card.Title>Stats</Card.Title>
      <ProgressBar
        variant="danger"
        max={character?.max_hp}
        now={character?.hp}
        label={`${character?.hp} / ${character?.max_hp}`}
      />
      <ProgressBar
        variant="success"
        max={character?.max_xp}
        now={character?.xp}
        label={`${character?.xp} / ${character?.max_xp}`}
      />
    </Card.Body>
    <Card.Footer>
      <Button variant="danger" onClick={doRest} disabled={!ready}>
        Rest
      </Button>
    </Card.Footer>
  </Card>
)

export { StatsCard }
