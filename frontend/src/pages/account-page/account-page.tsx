import { ItemModal } from '../../components/modals/item-modal.tsx'
import { useItemModal } from '../../utils/contexts/modal/hooks.ts'
import { CharactersPage } from '../characters-page/characters-page.tsx'

interface Props {
  accountName: string
}

const AccountPage = ({ accountName }: Props) => {
  const itemModalContext = useItemModal()

  return (
    <>
      {itemModalContext.show && itemModalContext.item && (
        <ItemModal
          show={itemModalContext.show}
          item={itemModalContext.item}
          handleClose={itemModalContext.handleClose}
        />
      )}
      <CharactersPage accountName={accountName} />
    </>
  )
}

export { AccountPage }
