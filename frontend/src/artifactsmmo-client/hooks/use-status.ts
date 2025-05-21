import { Temporal } from '@js-temporal/polyfill'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useApiClient } from './use-api-client.ts'

const key = 'status'

const useStatus = () => {
  const { client } = useApiClient()

  return useSuspenseQuery({
    queryKey: [key],
    queryFn: async () => {
      const result = await client.GET('/')
      if (!result.data) return { timeDiff: Temporal.Duration.from('PT10S') }
      const serverTime = Temporal.Instant.from(result.data.data.server_time)
      const now = Temporal.Now.instant()
      const timeDiff = serverTime.until(now)
      return { ...result.data.data, timeDiff }
    },
    refetchInterval: 30_000,
  })
}

export { useStatus }
