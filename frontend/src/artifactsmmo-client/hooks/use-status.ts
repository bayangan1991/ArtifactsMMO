import { Temporal } from '@js-temporal/polyfill'
import { useCallback, useContext, useState } from 'react'
import { useInterval } from '../../hooks/use-interval.ts'
import { ApiClientContext } from '../client/context.ts'

const useStatus = () => {
  const [timeDiff, setTimeDiff] = useState<Temporal.Duration>(Temporal.Duration.from('PT0S'))
  const { client } = useContext(ApiClientContext)
  const getTime = useCallback(() => {
    client.GET('/').then((response) => {
      if (response.data) {
        const serverTime = Temporal.Instant.from(response.data.data.server_time)
        const now = Temporal.Now.instant()
        setTimeDiff(serverTime.until(now))
        console.log('get status')
      }
    })
  }, [client])

  useInterval(getTime, 30_000)

  return timeDiff
}

export { useStatus }
