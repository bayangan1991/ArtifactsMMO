import createClient, { type Middleware } from 'openapi-fetch'
import type { paths } from './spec'

const client = createClient<paths>({ baseUrl: 'https://api.artifactsmmo.com/' })

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_TOKEN}`)
    return request
  },
}

client.use(authMiddleware)

export { client }
