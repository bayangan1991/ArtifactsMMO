import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Button, ButtonGroup, Dropdown, Form, InputGroup, Stack } from 'react-bootstrap'
import { useBankDetails } from '../../../artifactsmmo-client/hooks/use-bank-details.ts'
import type { Position } from '../../../types.ts'

import {useCharacterActions} from "../../../hooks/use-character-actions.ts";

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
  const { data: bankDetails } = useBankDetails()
  const {
    character,
    actions: { depositAll, buyExpansion, depositGold, withdrawGold },
  } = useCharacterActions()

  return (
    <Stack gap={2}>
      <Stack gap={2} direction="horizontal">
        <Dropdown as={ButtonGroup}>
          <Button onClick={() => depositAll({ pos })}>Deposit all items</Button>
          <Dropdown.Toggle split />
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => depositAll({ pos, requeue: false, returnToPos: true })}>
              and return
            </Dropdown.Item>
            <Dropdown.Item onClick={() => depositAll({ pos, requeue: true, returnToPos: false })}>
              repeatedly
            </Dropdown.Item>
            <Dropdown.Item onClick={() => depositAll({ pos, requeue: true, returnToPos: true })}>
              repeatedly and return
            </Dropdown.Item>
            <Dropdown.Item onClick={() => depositAll({ pos, ifFull: true, requeue: true, returnToPos: false })}>
              if full repeatedly
            </Dropdown.Item>
            <Dropdown.Item onClick={() => depositAll({ pos, ifFull: true, requeue: true, returnToPos: true })}>
              if full repeatedly and return
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button onClick={() => buyExpansion()}>
          Buy Expansion (<Icon icon={faCoins} color="#ffd82f" fixedWidth />
          {bankDetails?.next_expansion_cost.toLocaleString()})
        </Button>
      </Stack>
      <Stack gap={2} direction="horizontal">
        <BankGoldAction action={depositGold} label="Deposit" initial={character?.gold} />
        <BankGoldAction action={withdrawGold} label="Withdraw" initial={bankDetails?.gold} />
      </Stack>
    </Stack>
  )
}

export { BankDetail }
