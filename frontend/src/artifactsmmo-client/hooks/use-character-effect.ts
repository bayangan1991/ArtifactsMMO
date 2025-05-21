import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../use-api-client/use-api-client.ts'

const key = 'characterEffect'

interface Params {
  code?: string | null
}

const useCharacterEffect = ({ code }: Params) => {
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key, code],
    queryFn: async () => {
      if (!code) return
      const result = await client.GET('/effects/{code}', { params: { path: { code } } })
      return result.data?.data || null
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!code,
  })
}

export { useCharacterEffect }
