import { faBank, faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Nav } from 'react-bootstrap'
import type { components } from '../../artifactsmmo-client/spec'
import { BankItemsContext } from '../../utils/contexts/bank-items/context.ts'
import * as Tabs from './tabs'

interface Props {
  character: components['schemas']['CharacterSchema']
  depositItem(code: string, quantity: number): void
  withdrawItem(code: string, quantity: number, index?: number, requeue?: boolean): void
}

const InventoryCard = ({ character, depositItem, withdrawItem }: Props) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'bank'>('inventory')
  const { refetch } = useContext(BankItemsContext)

  return (
    <>
      <Nav variant="underline" className="mb-2">
        <Nav.Item>
          <Nav.Link active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>
            <Icon icon={faBoxArchive} /> Inventory
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            active={activeTab === 'bank'}
            onClick={() => {
              refetch().then(() => setActiveTab('bank'))
            }}
          >
            <Icon icon={faBank} /> Bank
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {activeTab === 'inventory' && <Tabs.Inventory character={character} action={depositItem} />}
      {activeTab === 'bank' && <Tabs.Bank inventorySize={character.inventory_max_items} action={withdrawItem} />}
    </>
  )
}

export { InventoryCard }
