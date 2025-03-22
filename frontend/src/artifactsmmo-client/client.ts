import createClient, { type Middleware } from 'openapi-fetch'
import createApiClient from 'openapi-react-query'
import type { paths } from './spec'

const client = createClient<paths>({ baseUrl: 'https://api.artifactsmmo.com/' })

const authMiddleware: Middleware = {
  async onRequest({ request, options }) {
    console.log(options)
    request.headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_TOKEN}`)
    return request
  },
}

client.use(authMiddleware)

const $api = createApiClient(client)

export { client, $api }
