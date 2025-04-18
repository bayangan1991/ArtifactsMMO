import { useCallback, useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

interface Params {
  npc: string
  size?: number
}

const useNpcItems = ({ npc, size = 10 }: Params) => {
  const { client } = useContext(ApiClientContext)
  const [items, setItems] = useState<components['schemas']['DataPage_NPCItem_'] | null>(null)

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to reset the page when the skill changes
  useEffect(() => {
    setPage(1)
  }, [npc])

  const handleSetPage = useCallback(
    (page: number) => setPage(Math.max(1, Math.min(page, items?.pages || 1))),
    [items?.pages]
  )

  useEffect(() => {
    client.GET('/npcs/{code}/items', { params: { path: { code: npc }, query: { page, size } } }).then((response) => {
      if (response.data) {
        setItems(response.data)
        setPages(response.data.pages || null)
      } else setItems(null)
    })
  }, [client, npc, page, size])

  return { items, pagination: { setPage: handleSetPage, page, pages } }
}

export { useNpcItems }
