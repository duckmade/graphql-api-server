import { AuthorizationCode } from "simple-oauth2"
import { PATREON_HOST, PATREON_ID, PATREON_SECRET } from "../variables"

const authInstance = (credentials: any) => {
  if (!credentials.client.id) {
    throw new Error("MISSING REQUIRED ENV VARS. Please set PATREON_ID.")
  }
  if (!credentials.client.secret) {
    throw new Error("MISSING REQUIRED ENV VARS. Please set PATREON_SECRET.")
  }
  return new AuthorizationCode(credentials)
}

export default authInstance({
  client: {
    id: PATREON_ID,
    secret: PATREON_SECRET,
  },
  auth: {
    tokenHost: PATREON_HOST,
    authorizePath: `${PATREON_HOST}/oauth2/authorize`,
    tokenPath: `${PATREON_HOST}/api/oauth2/token`,
  },
})
