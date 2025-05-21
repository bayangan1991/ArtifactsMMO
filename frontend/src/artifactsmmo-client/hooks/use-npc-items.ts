import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useApiClient } from './use-api-client.ts'

const key = 'npcItems'

interface Params {
  npc?: string | null
}

const useNpcItems = ({ npc }: Params) => {
  const { client } = useApiClient()

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState<number | null>(null)

  const query = useQuery({
    queryKey: [key, { npc, page }],
    queryFn: async () => {
      if (!npc) return
      const result = await client.GET('/npcs/{code}/items', {
        params: { path: { code: npc }, query: { page, size: 10 } },
      })
      return result.data || null
    },
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPages(query.data?.pages || null)
  }, [query.data?.pages])

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to reset the page when the skill changes
  useEffect(() => {
    setPage(1)
  }, [npc])

  return { query, pagination: { setPage, page, pages } }
}

export { useNpcItems }
