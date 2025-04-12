import { faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'

interface Props {
  action(code: string, quantity: number, queueIndex?: number, requeue?: boolean): void
  code: string
  quantity: number
  max: number
}

export const ItemActionGroup = ({ action, code, quantity, max }: Props) => {
  const [selectedQuantity, setSelectedQuantity] = useState(Math.min(quantity, max))

  useEffect(() => {
    setSelectedQuantity(Math.min(quantity, max))
  }, [quantity, max])

  return (
    <InputGroup size="sm">
      <Form.Control
        type="number"
        value={selectedQuantity}
        onChange={(e) => setSelectedQuantity(Number(e.target.value))}
        max={max}
        min={1}
      />
      <Button onClick={() => action(code, selectedQuantity)}>Some</Button>
      <Button variant="danger" onClick={() => action(code, quantity)}>
        All
      </Button>
      <Button onClick={() => action(code, selectedQuantity, undefined, true)}>
        <Icon icon={faRepeat} />
      </Button>
    </InputGroup>
  )
}
