import { Form, InputGroup, type InputGroupProps } from 'react-bootstrap'

interface Props extends InputGroupProps {
  page?: number | null
  pages?: number | null
  setPage: (p: number) => void
}

const Pagination = ({ page, pages, setPage, ...rest }: Props) => (
  <InputGroup style={{ maxWidth: '150px' }} {...rest}>
    <Form.Control
      type="number"
      value={page || undefined}
      max={pages || undefined}
      onChange={(e) => setPage(Number(e.target.value))}
    />
    <InputGroup.Text>of {pages || '?'}</InputGroup.Text>
  </InputGroup>
)

export { Pagination }
