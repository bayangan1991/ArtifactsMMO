import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useContext, useState } from 'react'
import { Button, Col, Form, InputGroup, Modal, Row, Stack } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router'
import { AccountContext } from '../../utils/accounts/context.ts'
import type { Account } from '../../utils/accounts/types.ts'

interface Props {
  show: boolean
  handleClose(): void
}

const AccountsModal = ({ show, handleClose }: Props) => {
  const navigate = useNavigate()
  const { accounts, save } = useContext(AccountContext)
  const [currentAccounts, setCurrentAccounts] = useState<Account[]>(accounts)
  const { accountName } = useParams()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(accountName || null)

  const { handleSubmit, register } = useForm<Account>()

  const addAccount = useCallback(
    (account: Account) => {
      for (const savedAccount of currentAccounts) {
        if (account.name === savedAccount.name) return
      }
      setCurrentAccounts((current) => {
        const clone = [...current]
        clone.push(account)
        return clone
      })
    },
    [currentAccounts]
  )

  const removeAccount = (name: string) => {
    setCurrentAccounts((prevState) => prevState.filter((item) => item.name !== name))
  }

  const handleSave = () => {
    save(currentAccounts)
    handleClose()
    if (selectedAccount) navigate(`/${selectedAccount}/`)
  }

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton>Accounts</Modal.Header>
      <Modal.Body className="d-flex gap-4 flex-column">
        <Row>
          <Col>
            <h6>Add New Account</h6>
            <Form onSubmit={handleSubmit(addAccount)}>
              <InputGroup>
                <Form.Control type="text" placeholder="Name" {...register('name', { required: true })} />
                <Form.Control type="password" placeholder="API Key" {...register('apiKey', { required: true })} />

                <Button variant="outline-primary" type="submit">
                  Add
                </Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        {!!currentAccounts.length && (
          <Row>
            <Col>
              <h6>Current Accounts</h6>
              <Stack gap={2}>
                {currentAccounts.map((account) => (
                  <InputGroup key={account.name}>
                    <InputGroup.Text className="flex-fill">{account.name}</InputGroup.Text>
                    <InputGroup.Radio
                      name="active-account"
                      defaultChecked={selectedAccount === account.name}
                      onClick={() => setSelectedAccount(account.name)}
                    />
                    <Button variant="outline-danger" onClick={() => removeAccount(account.name)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </InputGroup>
                ))}
              </Stack>
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" className="me-auto" onClick={handleClose}>
          Close
        </Button>
        <Button variant="success" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export { AccountsModal }
