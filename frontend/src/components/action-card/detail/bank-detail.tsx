import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Button, ButtonGroup, Dropdown, Form, InputGroup, Stack } from 'react-bootstrap'
import type { Position } from '../../../types.ts'
import { BankItemsContext } from '../../../utils/contexts/bank-items/context.ts'
import { CharacterContext } from '../../../utils/contexts/character/context.ts'

const BankGoldAction = ({
  action,
  label,
  initial = 0,
}: { action: (args: { quantity: number }) => void; label: string; initial?: number }) => {
  const [amount, setAmount] = useState(initial)

  return (
    <div>
      <InputGroup>
        <Form.Control type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <Button onClick={() => action({ quantity: amount })}>
          <Icon icon={faCoins} color="#ffd82f" fixedWidth />
          {label}
        </Button>
      </InputGroup>
    </div>
  )
}

const BankDetail = ({ pos }: { pos: Position }) => {
  const { bankDetails } = useContext(BankItemsContext)
  const {
    character,
    actions: { depositAll, buyExpansion, depositGold, withdrawGold },
  } = useContext(CharacterContext)

  return (
    <Stack gap={2}>
      <Stack gap={2} direction="horizontal">
        <Dropdown as={ButtonGroup}>
          <Button onClick={() => depositAll(pos)}>Deposit all items</Button>
          <Dropdown.Toggle split />

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => depositAll(pos, false, true)}>and return</Dropdown.Item>
            <Dropdown.Item onClick={() => depositAll(pos, true, false)}>repeatedly</Dropdown.Item>
            <Dropdown.Item onClick={() => depositAll(pos, true, true)}>repeatedly and return</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button onClick={() => buyExpansion()}>
          Buy Expansion (<Icon icon={faCoins} color="#ffd82f" fixedWidth />
          {bankDetails?.data.next_expansion_cost.toLocaleString()})
        </Button>
      </Stack>
      <Stack gap={2} direction="horizontal">
        <BankGoldAction action={depositGold} label="Deposit" initial={character?.gold} />
        <BankGoldAction action={withdrawGold} label="Withdraw" initial={bankDetails?.data.gold} />
      </Stack>
    </Stack>
  )
}

export { BankDetail }
