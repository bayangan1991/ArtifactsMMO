import { useQuery } from '@tanstack/react-query'
import { useApiClient } from './use-api-client.ts'

const key = 'bankDetails'

const useBankDetails = () => {
  const { client } = useApiClient()

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const result = await client.GET('/my/bank')
      return result.data?.data || null
    },
  })
}

export { useBankDetails }
