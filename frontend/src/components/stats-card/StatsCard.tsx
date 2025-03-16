import { Guid } from 'guid-typescript'
import { Button, Card, ProgressBar } from 'react-bootstrap'
import type { components } from '../../artifactsmmo-client/spec'
import type { Queue } from '../../types.ts'

interface SimpleAction {
  label: string
  variant: string
  action: () => Promise<null>
}

interface Props {
  character: components['schemas']['CharacterSchema'] | null
  simpleActions?: SimpleAction[]
  queueAction(f: Queue): void
}

const StatsCard = ({ character, simpleActions = [], queueAction }: Props) => (
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
    <Card.Footer className="d-flex gap-2">
      {simpleActions.map((action) => (
        <Button
          key={action.label}
          variant={action.variant}
          onClick={() => queueAction({ guid: Guid.create(), label: action.label, action: action.action })}
        >
          {action.label}
        </Button>
      ))}
    </Card.Footer>
  </Card>
)

export { StatsCard }
