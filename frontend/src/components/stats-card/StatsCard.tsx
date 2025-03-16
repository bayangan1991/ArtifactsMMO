import { Guid } from 'guid-typescript'
import { Button, Card, ProgressBar } from 'react-bootstrap'
import type { components } from '../../artifactsmmo-client/spec'
import type { Queue } from '../../types.ts'

interface Props {
  character: components['schemas']['CharacterSchema'] | null
  doRest: () => Promise<null>
  queueAction(f: Queue): void
}

const StatsCard = ({ character, doRest, queueAction }: Props) => (
  <Card>
    <Card.Body className="d-flex flex-column gap-2">
      <Card.Title>Stats</Card.Title>
      {!character && (
        <>
          <ProgressBar variant="danger" striped animated now={100} label="Loading..." />
          <ProgressBar variant="success" striped animated now={100} label="Loading..." />
        </>
      )}
      {character && (
        <>
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
        </>
      )}
    </Card.Body>
    <Card.Footer>
      <Button variant="danger" onClick={() => queueAction({ guid: Guid.create(), label: 'Rest', action: doRest })}>
        Rest
      </Button>
    </Card.Footer>
  </Card>
)

export { StatsCard }
