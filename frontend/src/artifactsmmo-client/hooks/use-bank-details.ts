import { useQuery } from '@tanstack/react-query'
import { useContext } from 'react'
import { ApiClientContext } from '../client/context.ts'

const key = 'bankDetails'

const useBankDetails = () => {
  const { client } = useContext(ApiClientContext)

  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      const result = await client.GET('/my/bank')
      return result.data?.data
    },
  })
}

export { useBankDetails }
