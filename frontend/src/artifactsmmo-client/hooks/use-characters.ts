import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useApiClient } from '../use-api-client/use-api-client.ts'
import { characterKey } from './use-character.ts'

const key = 'characters'

interface Params {
  account?: string | null
}

const useCharacters = ({ account }: Params) => {
  const queryClient = useQueryClient()
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key, account],
    queryFn: async () => {
      if (!account) return
      const result = await client.GET('/accounts/{account}/characters', { params: { path: { account: account } } })
      if (result.data?.data) {
        for (const character of result.data.data) {
          queryClient.setQueryData([characterKey, character.name], character)
        }
      }
      return result.data?.data || null
    },
    refetchInterval: 15_000,
    enabled: !!account,
  })
}
export { useCharacters }
