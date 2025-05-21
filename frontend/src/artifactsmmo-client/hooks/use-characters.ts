import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../use-api-client/use-api-client.ts'

const key = 'characters'

interface Params {
  account?: string | null
}

const useCharacters = ({ account }: Params) => {
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key, account],
    queryFn: async () => {
      if (!account) return
      const result = await client.GET('/accounts/{account}/characters', { params: { path: { account: account } } })
      return result.data?.data || null
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!account,
  })
}
export { useCharacters }
