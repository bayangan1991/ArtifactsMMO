import { useCallback, useContext, useEffect, useState } from 'react'
import { ApiClientContext } from '../client/context.ts'
import type { components } from '../spec'

const useBankDetails = () => {
  const { client } = useContext(ApiClientContext)
  const [bankDetails, setBankDetails] = useState<components['schemas']['BankResponseSchema'] | null>(null)

  const refetch = useCallback(async () => {
    const result = await client.GET('/my/bank')
    if (result.data) {
      setBankDetails(result.data)
    }
  }, [client])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { bankDetails, refetch }
}

export { useBankDetails }
