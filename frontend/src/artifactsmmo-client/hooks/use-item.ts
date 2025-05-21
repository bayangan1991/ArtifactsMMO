import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../use-api-client/use-api-client.ts'

interface Params {
  code?: string | null
}

const key = 'item'

const useItem = ({ code }: Params) => {
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key, code],
    queryFn: async () => {
      if (!code) return
      const result = await client.GET('/items/{code}', { params: { path: { code } } })
      return result.data?.data || null
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!code,
  })
}

export { useItem, key as itemKey }
