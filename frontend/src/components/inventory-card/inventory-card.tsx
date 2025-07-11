import { faBank, faHatWizard, faSackDollar, faShop } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Nav } from 'react-bootstrap'
import { useBankItems } from '../../artifactsmmo-client/hooks/use-bank-items.ts'
import * as Tabs from './tabs'

const InventoryCard = () => {
  const [activeTab, setActiveTab] = useState<'character' | 'inventory' | 'bank' | 'grand-exchange'>('character')
  const {
    query: { refetch },
  } = useBankItems()

  return (
    <>
      <Nav variant="underline" className="mb-0 px-2">
        <Nav.Item>
          <Nav.Link active={activeTab === 'character'} onClick={() => setActiveTab('character')}>
            <Icon icon={faHatWizard} /> Character
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')}>
            <Icon icon={faSackDollar} /> Inventory
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
        <Nav.Item className="ms-auto">
          <Nav.Link
            active={activeTab === 'grand-exchange'}
            onClick={() => {
              refetch().then(() => setActiveTab('grand-exchange'))
            }}
          >
            <Icon icon={faShop} /> Grand Exchange
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {activeTab === 'character' && <Tabs.Character />}
      {activeTab === 'inventory' && <Tabs.Inventory />}
      {activeTab === 'bank' && <Tabs.Bank />}
      {activeTab === 'grand-exchange' && <Tabs.GrandExchange />}
    </>
  )
}

export { InventoryCard }
