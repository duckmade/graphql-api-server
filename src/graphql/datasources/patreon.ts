import { Pool } from "undici"
import {
  HTTPDataSource,
  // Request,
  // Response,
  // RequestError,
} from "apollo-datasource-http"

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

  // async onRequest(request: Request): Promise<void> {
  //   // manipulate request before it is send
  //   // for example assign a AbortController signal to all requests and abort

  //   request.signal = this.context.abortController.signal

  //   setTimeout(() => {
  //     this.context.abortController.abort()
  //   }, 3000).unref()
  // }

  // onResponse<TResult = unknown>(
  //   request: Request,
  //   response: Response<TResult>
  // ): Response<TResult> {
  //   // manipulate response or handle unsuccessful response in a different way
  //   return super.onResponse(request, response)
  // }

  // onError(error: Error, request: Request): void {
  //   // in case of a request error
  //   if (error instanceof RequestError) {
  //     console.log(error.request, error.response)
  //   }
  // }

  async getMemberships() {
    return this.get(`/api/oauth2/v2/identity`, {
      query: {
        include: "memberships",
      },
      context: {
        tracingName: "getMemberships",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${this.context.cookies.patreon}`,
      },
      requestCache: {
        maxTtl: 10 * 60, // 10min, will respond for 10min with the cached result (updated every 10min)
        maxTtlIfError: 30 * 60, // 30min, will respond with the cached response in case of an error (for further 20min)
      },
    })
  }
}

export default PatreonAPI
