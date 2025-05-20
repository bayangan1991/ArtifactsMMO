import { useQuery } from '@tanstack/react-query'
import { useClient } from '../client/hooks.ts'

interface Params {
  code?: string | null
}

const itemKey = 'item'

const useItem = ({ code }: Params) => {
  const { client } = useClient()

  return useQuery({
    queryKey: [itemKey, code],
    queryFn: async () => {
      if (!code) return
      const result = await client.GET('/items/{code}', { params: { path: { code } } })
      return result?.data?.data
    },
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled: !!code,
  })
}

export { useItem }
