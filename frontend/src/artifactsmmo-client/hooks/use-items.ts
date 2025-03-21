import { useCallback, useEffect, useState } from 'react'
import { client } from '../client'
import type { components } from '../spec'

interface Params {
  skill?: components['schemas']['CraftSkill']
  size?: number
  skip?: boolean
}

const useItems = ({ skill, skip = false, size = 10 }: Params) => {
  const [items, setItems] = useState<components['schemas']['DataPage_ItemSchema_'] | null>(null)
  const [page, setPage] = useState(1)

  const handleSetPage = useCallback(
    (page: number) => setPage(Math.max(1, Math.min(page, items?.pages || 1))),
    [items?.pages]
  )

  useEffect(() => {
    if (!skip) {
      client.GET('/items', { params: { query: { craft_skill: skill, page, size } } }).then((response) => {
        if (response.data) {
          setItems(response.data)
        } else setItems(null)
      })
    }
    if (skip) setItems(null)
  }, [skill, page, skip, size])

  return { items, setPage: handleSetPage }
}

export { useItems }
