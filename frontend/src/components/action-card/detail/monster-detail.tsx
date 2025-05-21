import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Badge, ListGroup } from 'react-bootstrap'
import { useMonster } from '../../../artifactsmmo-client/hooks/use-monster.ts'
import { CharacterEffect } from '../../character-effect/character-effect.tsx'
import { Item } from '../../item/item.tsx'

const MonsterDetail = ({ code }: { code: string }) => {
  const { data: monster } = useMonster({ code: code })
  const damageTypes = ['air', 'earth', 'fire', 'water'] as const

  if (!monster) return null

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-end gap-2 mb-2">
          <div style={{ minWidth: 50 }} className="d-flex align-items-center justify-content-center">
            <img src={`https://artifactsmmo.com/images/monsters/${code}.png`} alt="" height={50} />
          </div>
          <h5>
            {monster.name} <small className="text-muted">lvl{monster.level}</small>
          </h5>
        </div>
        <h5>
          <Badge bg="danger">{monster.hp.toLocaleString()} HP</Badge>
        </h5>
      </div>
      <h6>Damage</h6>
      <ListGroup className="mb-2">
        {damageTypes.map(
          (type) =>
            monster[`attack_${type}`] > 0 && (
              <ListGroup.Item key={type}>
                <CharacterEffect code={`dmg_${type}`} /> x <strong>{monster[`attack_${type}`]}</strong>
              </ListGroup.Item>
            )
        )}
        {monster.critical_strike !== 0 && (
          <ListGroup.Item>
            <CharacterEffect code="critical_strike" /> x <strong>{monster.critical_strike}%</strong>
          </ListGroup.Item>
        )}
      </ListGroup>
      <h6>Resistance</h6>
      <ListGroup className="mb-2">
        {damageTypes.map(
          (type) =>
            monster[`res_${type}`] !== 0 && (
              <ListGroup.Item key={type}>
                <CharacterEffect code={`res_${type}`} /> x <strong>{monster[`res_${type}`]}%</strong>
              </ListGroup.Item>
            )
        )}
      </ListGroup>
      {!!monster.effects?.length && (
        <>
          <h6>Effects</h6>
          <ListGroup className="mb-2">
            {monster.effects.map((effect) => (
              <ListGroup.Item key={effect.code}>
                <CharacterEffect code={effect.code} imgProps={{ height: 20 }} />{' '}
                <small className="text-muted">{effect.value}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      )}
      <h6>Drops</h6>
      <ListGroup>
        <ListGroup.Item>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth /> {monster.min_gold.toLocaleString()}-
          {monster.max_gold.toLocaleString()} gold
        </ListGroup.Item>
        {monster.drops.map((item) => (
          <ListGroup.Item key={item.code}>
            <Item code={item.code} imgProps={{ height: 20 }} />
            <small className="text-muted">
              {' '}
              x{item.min_quantity === item.max_quantity && item.min_quantity}
              {item.min_quantity !== item.max_quantity && `${item.min_quantity}-${item.max_quantity}`} @{' '}
              {((1 / item.rate) * 100).toFixed(2)}%
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export { MonsterDetail }
