import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { Pagination as BSPagination, type PaginationProps } from 'react-bootstrap'

interface Props extends PaginationProps {
  page?: number | null
  pages?: number | null
  setPage: (p: number) => void
}

const Pagination = ({ page, pages, setPage, ...paginationProps }: Props) => {
  if (!page || !pages || pages === 1) return

  return (
    <BSPagination {...paginationProps} className={`${paginationProps.className || ''} mb-0`}>
      <BSPagination.Item disabled={page === 1} onClick={() => setPage(page - 1)}>
        <Icon icon={faAngleLeft} />
      </BSPagination.Item>
      {page !== 1 && <BSPagination.Item onClick={() => setPage(1)}>{1}</BSPagination.Item>}
      {page > 4 && <BSPagination.Ellipsis />}
      {page === 4 && <BSPagination.Item onClick={() => setPage(page - 2)}>{page - 2}</BSPagination.Item>}
      {page > 2 && <BSPagination.Item onClick={() => setPage(page - 1)}>{page - 1}</BSPagination.Item>}
      <BSPagination.Item active>{page}</BSPagination.Item>
      {pages - page > 1 && <BSPagination.Item onClick={() => setPage(page + 1)}>{page + 1}</BSPagination.Item>}
      {pages - page === 3 && <BSPagination.Item onClick={() => setPage(page + 2)}>{page + 2}</BSPagination.Item>}
      {pages - page > 3 && <BSPagination.Ellipsis />}
      {page !== pages && <BSPagination.Item onClick={() => setPage(pages)}>{pages}</BSPagination.Item>}
      <BSPagination.Item disabled={page === pages} onClick={() => setPage(page + 1)}>
        <Icon icon={faAngleRight} />
      </BSPagination.Item>
    </BSPagination>
  )
}

export { Pagination }
