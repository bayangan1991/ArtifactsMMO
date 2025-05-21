import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useApiClient } from '../use-api-client/use-api-client.ts'

const key = 'character'

interface Params {
  name?: string | null
}

const useCharacter = ({ name }: Params) => {
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key, name],
    queryFn: async () => {
      if (!name) return
      const result = await client.GET('/characters/{name}', { params: { path: { name } } })
      return result.data?.data || null
    },
    refetchInterval: 15_000,
    placeholderData: keepPreviousData,
    enabled: !!name,
  })
}

export { useCharacter, key as characterKey }
