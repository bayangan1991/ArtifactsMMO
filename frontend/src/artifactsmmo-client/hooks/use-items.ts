import { useCallback, useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

interface Params {
  skill?: components['schemas']['CraftSkill']
  craftMaterial?: string
  size?: number
  skip?: boolean
}

const useItems = ({ skill, craftMaterial, skip = false, size = 10 }: Params) => {
  const { client } = useContext(ApiClientContext)
  const [items, setItems] = useState<components['schemas']['DataPage_ItemSchema_'] | null>(null)

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to reset the page when the skill changes
  useEffect(() => {
    setPage(1)
  }, [skill])

  const handleSetPage = useCallback(
    (page: number) => setPage(Math.max(1, Math.min(page, items?.pages || 1))),
    [items?.pages]
  )

  useEffect(() => {
    if (!skip) {
      client
        .GET('/items', { params: { query: { craft_skill: skill, craft_material: craftMaterial, page, size } } })
        .then((response) => {
          if (response.data) {
            setItems(response.data)
            setPages(response.data.pages || null)
          } else setItems(null)
        })
    }
    if (skip) setItems(null)
  }, [client, craftMaterial, skill, page, skip, size])

  return { items, pagination: { setPage: handleSetPage, page, pages } }
}

export { useItems }
