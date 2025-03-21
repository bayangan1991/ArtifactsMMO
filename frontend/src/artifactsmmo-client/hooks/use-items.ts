import { useState } from 'react'
import { client } from '../client'
import type { components } from '../spec'

interface Params {
  skill: components['schemas']['Skill']
}

const useItems = ({ skill }: Params) => {
  const [items, setItems] = useState<components['schemas']['DataPage_ItemSchema_'] | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    client.GET('/items', { query: { craft: skill, page } }).then((response) => {
      if (response) setItems(response)
    })
  }, [skill, page])

  return { items, setPage }
}

export { useItems }
