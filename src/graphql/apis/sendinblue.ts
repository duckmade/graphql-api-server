import { Pool } from "undici"
import {
  HTTPDataSource,
  // Request,
  // Response,
  // RequestError,
} from "apollo-datasource-http"
import { MutationSendMailArgs } from "../generated"

class SendInBlueAPI extends HTTPDataSource {
  constructor(baseURL: string, apiKey: string) {
    super(baseURL, {
      pool: new Pool(baseURL),
      clientOptions: {
        bodyTimeout: 5000,
        headersTimeout: 2000,
      },
      requestOptions: {
        headers: {
          "X-Client": "client",
          "Api-Key": apiKey,
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

  async sendEmail(args: MutationSendMailArgs) {
    return this.post(`/v3/smtp/email`, {
      context: {
        tracingName: "sendEmail",
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: {
        sender: {
          name: args.name,
          email: args.email,
        },
        to: [
          {
            name: "Hello at DUCKMADE",
            email: "hello@duckmade.io",
          },
        ],
        subject: `New message from duckmade.io!`,
        replyTo: {
          name: args.name,
          email: args.email,
        },
        htmlContent: `
            <p><b>Name:</b><br />${args.name}</p>
            <p><b>Email:</b><br />${args.email}</p>
            <p><b>Subject:</b><br />${args.subject}</p>
            <p><b>Message:</b><br />${args.message}</p>
          `,
        textContent: `subject: ${args.subject}, args: ${args.message}`,
      },
    })
  }
}

export default SendInBlueAPI
