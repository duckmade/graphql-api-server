import { Pool } from "undici"
import { HTTPDataSource } from "apollo-datasource-http"
import { PatreonStatusResponse } from "../generated"

class PatreonAPI extends HTTPDataSource {
  constructor(baseURL: string) {
    super(baseURL, {
      pool: new Pool(baseURL),
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
      requestOptions: {
        headers: {
          "X-Client": "client",
        },
      },
    })
  }

  async getMemberStatus(): Promise<PatreonStatusResponse> {
    return this.get("/api/oauth2/v2/identity", {
      query: {
        include: "memberships",
      },
      context: {
        tracingName: "getMemberStatus",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${this.context.cookies.patreon}`,
      },
    })
      .then((res) => JSON.parse(res.body as string))
      .then((res) => ({
        member: res.data.relationships?.memberships?.data?.length > 0 || false,
      }))
  }
}

export default PatreonAPI
