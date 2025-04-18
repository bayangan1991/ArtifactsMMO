import { ListGroup } from 'react-bootstrap'
import { useResource } from '../../../artifactsmmo-client/hooks/use-resource.ts'
import { Item } from '../../item/item.tsx'

const ResourceDetail = ({ code }: { code: string }) => {
  const resource = useResource(code)

  if (!resource) return null

  return (
    <div>
      <div className="d-flex justify-content-start align-items-end gap-2 mb-2">
        <div style={{ minWidth: 50 }} className="d-flex align-items-center justify-content-center">
          <img src={`https://artifactsmmo.com/images/resources/${code}.png`} alt="" height={50} />
        </div>
        <h5>
          {resource.name}{' '}
          <small className="text-muted">
            {resource.skill}@lvl{resource.level}
          </small>
        </h5>
      </div>
      <ListGroup>
        {resource.drops.map((item) => (
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

export { ResourceDetail }
